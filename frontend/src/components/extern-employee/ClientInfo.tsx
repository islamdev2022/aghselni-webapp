import { User } from "lucide-react"
interface ClientProps {
    client?: {
      name: string;
      phone: string;
      photo: string;
      full_name: string;
    };
  }

export default function ClientInfo({ client }: ClientProps) {
  if (!client) return null
  
  return (
    <div className="flex items-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
        <img
          src={`http://127.0.0.1:8000${client.photo}` || ""}
          alt={client.full_name}
          className="h-full w-full rounded-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.style.display = 'none';
            if (img.nextSibling) {
              (img.nextSibling as HTMLElement).style.display = 'block';
            }
          }}
        />
        <User className="h-4 w-4" style={{ display: 'none' }} />
      </div>
      <span className="ml-2">{client.full_name}</span>
    </div>
  )
}