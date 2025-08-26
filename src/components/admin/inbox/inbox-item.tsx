"use client";
import { InboxMessage } from "@/lib/dummyInbox";
import { formatDate } from "@/lib/formatData";

type Props = {
  message: InboxMessage;
  selectedMessage: InboxMessage | null;
  onClick: (id: string) => void;
};

export default function InboxItem({ message, selectedMessage, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(message.contact_id)}
      className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
        message.contact_id === selectedMessage?.contact_id ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="font-medium">{message.contact_name}</p>
        <span className="text-xs text-gray-500">{formatDate(message.contact_created_at)}</span>
      </div>
      <p className="text-sm text-gray-600 truncate">{message.contact_subject}</p>
    </div>
  );
}
