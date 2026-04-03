import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";




function ResetPassword({ user }: any) {
const [data , setData] = useState<any>();
const routeur = useRouter();
    async function verifyResetPassword() {

        try {
            const Metadata = await fetch(`api/Montfermeil/PasswordForgot/${user.id}`);
            const json = await Metadata.json();

            setData(json);
        }catch(ex){
            console.log(ex);
        }


    }
    useEffect(()=>{
        verifyResetPassword();
    },[])

    return (
        <div>
            {data.oublie && <button onClick={() => routeur.push("/Nouveau/MotsDePasse")}> Changer le mots de passe</button> }
        </div>  

    );
}