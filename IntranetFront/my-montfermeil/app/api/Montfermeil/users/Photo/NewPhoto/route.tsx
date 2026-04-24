import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const req = await request.formData();
        const backend = process.env.BACKEND_API;
        const auth = request.headers.get("authorization");
        
        // Vérification du token
        if (!auth || !auth.startsWith("Bearer ")) {
            console.error("Token manquant ou invalide");
            return NextResponse.json({ error: "Token manquant" }, { status: 401 });
        }
        
        const file = req.get("file") as Blob;
        const email = req.get("email") as string;
        
        if (!file) {
            return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
        }
        
        if (!email) {
            return NextResponse.json({ error: "Email manquant" }, { status: 400 });
        }
        
        console.log("Email reçu:", email);
        
        // ÉTAPE 1: Essayer d'abord de modifier la photo existante
        console.log("Tentative de modification de la photo...");
        
        const modifyFormData = new FormData();
        modifyFormData.append("file", file);
        modifyFormData.append("email", email);
        
        const modifyResponse = await fetch(`${backend}/Photo/Modifier`, {
            method: "PUT",
            headers: {
                "Authorization": auth
            },
            body: modifyFormData
        });
        
        // Si la modification réussit (202 ACCEPTED), on retourne la réponse
        if (modifyResponse.status === 202 || modifyResponse.ok) {
            const responseData = await modifyResponse.text();
            console.log("Photo modifiée avec succès");
            return NextResponse.json({ message: responseData }, { status: 200 });
        }
        
        // Si la modification échoue avec 400 (photo non trouvée), on essaie de créer
        if (modifyResponse.status === 400) {
            console.log("Aucune photo existante trouvée, création d'une nouvelle photo...");
            
            // Créer une nouvelle photo avec l'email directement
            const createFormData = new FormData();
            createFormData.append("file", file);
            createFormData.append("mail", email); // Utilisez "mail" comme attendu par votre backend
            
            const createResponse = await fetch(`${backend}/Photo/Nouveaux`, {
                method: "POST",
                headers: {
                    "Authorization": auth
                },
                body: createFormData
            });
            
            if (!createResponse.ok) {
                const errorText = await createResponse.text();
                console.error(`Erreur création photo (${createResponse.status}):`, errorText);
                return NextResponse.json({ 
                    error: errorText,
                    status: createResponse.status 
                }, { status: createResponse.status });
            }
            
            const responseData = await createResponse.text();
            console.log("Photo créée avec succès");
            return NextResponse.json({ message: responseData }, { status: 200 });
        }
        
        // Pour toute autre erreur de modification (comme 401)
        const errorText = await modifyResponse.text();
        console.error(`Erreur modification photo (${modifyResponse.status}):`, errorText);
        
        // Si l'erreur est 401, le token est peut-être expiré ou invalide
        if (modifyResponse.status === 401) {
            return NextResponse.json({ 
                error: "Session expirée, veuillez vous reconnecter",
                status: 401 
            }, { status: 401 });
        }
        
        return NextResponse.json({ 
            error: errorText,
            status: modifyResponse.status 
        }, { status: modifyResponse.status });
        
    } catch (error) {
        console.error("Erreur complète:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}