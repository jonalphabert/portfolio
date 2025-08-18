import SubscribeModal from "./subscribe-modal";
import { toast } from 'sonner';

export default function SubscribeSection() {
    const handleSubscribe = async (data: { name: string; email: string }) =>  {
        console.log("Subscribed:", data);

        const result = await fetch('/api/guest/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(result.ok) {
            toast.success('Successfully subscribed');
        } else {
            toast.error('Could not subscribe');
        }
    }

    return (
        <SubscribeModal triggerLabel='Subscribe for updates' onSubscribe={handleSubscribe}/>
    )
}