import { getTemplateById } from "@/lib/template-data";
import { notFound } from "next/navigation";
import { PreviewRenderer } from "@/components/templates/preview-renderer"; // Import this

interface TemplatePageProps {
  params: {
    username: string;
  };
}

export default async function ProfileWithUsedTemplate({
  params,
}: TemplatePageProps) { 
  const username = params.username; // This is "jmdec22"
  
  // 1. Fetch the user's profile data
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`);
  const userData = await userResponse.json();
  
  if (!userData) {
    notFound();
  }
  
  // 2. Fetch the template configuration that this user selected
  const template = await getTemplateById(userData.selectedTemplateId);
  
  if (!template) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Use PreviewRenderer instead of individual template components */}
      <PreviewRenderer 
        template={template}
        user={userData}
      />
    </div>
  );
}
