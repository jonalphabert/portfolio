import { Button } from "@/components/ui/button";
import { InboxMessage } from "@/lib/dummyInbox";
import { X } from "lucide-react";
import { formatDate } from "@/lib/formatData";

type Props = {
  message: InboxMessage;
  onClose: () => void
};

export default function InboxDetail({ message, onClose }: Props) {
  return (
    <div>
        <div className="flex justify-end items-center mb-4">
            <Button size="sm" variant="ghost" className="hover:bg-transparent hover:text-destructive" onClick={onClose}><X/></Button>
        </div>
        <div className='flex justify-between items-center'>
            <h2 className="text-xl font-bold">{message.contact_subject}</h2>
            <p className="text-sm text-gray-500">{formatDate(message.contact_created_at)}</p>
        </div>
        <p className="text-sm text-gray-500 mb-4">
            Dari: {message.contact_name} ({message.contact_email})
        </p>
        <p className="text-gray-700 whitespace-pre-line">{message.contact_content}</p>
    </div>
  );
}
