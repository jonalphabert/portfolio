export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",   
    timeStyle: "short",  
  }).format(date);
};