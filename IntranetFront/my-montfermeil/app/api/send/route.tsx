import { EmailTemplate } from '@/app/component/email-template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {

    const body = await request.json();
    const { email, composition } = body;
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Hello world',
            react: EmailTemplate({ email: email }, { MDP: composition }),
        });

        if (error) {
            console.log(error)
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 });
    }
}