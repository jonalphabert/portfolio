"use client";
import { use, useEffect, useState } from "react";
import { InboxMessage } from "@/lib/dummyInbox";
import InboxItem from "./inbox-item";
import InboxDetail from "./inbox-detail";
import Pagination from "./pagination";
import { SearchInput } from "./search-input";

export default function InboxList() {
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<InboxMessage[]>([]);

  const getData = async () => {
    const params = new URLSearchParams();

    params.append("page", currentPage.toString());
    params.append("limit", "10");
    params.append("search", searchTerm);

    const response = await fetch(`/api/inbox?${params}`);
    const data = await response.json();

    setMessages(data.inbox || []);
    setTotalPages(data.pagination.totalPages || 1);

    setSelectedMessage(null);
  };

  useEffect(() => {
    getData();
  }, [searchTerm, currentPage]);

  const onChangePage = (page: number) => {
    setCurrentPage(page);
    console.log("onChangePage", page);
  };

  const searchHandler = (value: string) => {
    setSearchTerm(value);
  };

  const closeHander = () => {
    setSelectedMessage(null);
  };

  return (
    <div>
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold">Inbox</h1>
                <p className="text-muted-foreground mb-6">Manage your inbox</p>
            </div>
            <SearchInput placeholder="Search..." className="mb-6" value={searchTerm} onChange={searchHandler}/>
        </div>
        <div className="flex h-[80vh] border rounded-lg overflow-auto mb-6">
        {/* Sidebar List */}
        <div className={`${selectedMessage ? "w-1/3" : "w-full"} border-r overflow-y-auto`}>
            {messages.map((msg) => (
            <InboxItem key={msg.contact_id} message={msg} selectedMessage={selectedMessage} onClick={(id) => {
                const found = messages.find((m) => m.contact_id === id) || null;
                setSelectedMessage(found);
            }} />
            ))}
        </div>

        { selectedMessage && <div className="flex-1 p-6">
            <InboxDetail message={selectedMessage} onClose={closeHander} /></div>}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onChangePage} />
    </div>
    
  );
}
