import { getTemplateById } from "@/lib/template-data";
import { notFound } from "next/navigation";
import { TemplatePreviewContent } from "@/components/templates/template-preview-content";
import { TemplatePreviewHeader } from "@/components/templates/template-preview-header";
import { TemplatePreviewSidebar } from "@/components/templates/template-preview-sidebar";

interface TemplatePageProps {
  params: {
    username: string; // ✅ Fixed
  };
}

export default async function ProfileWithUsedTemplate({
  params,
}: TemplatePageProps) { 
  const username = params.username; // This is "jmdec22"
  
  // 1. Fetch the user's profile data
  const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/${username}`); // ✅ Fixed
  const userData = await userResponse.json();
  
  if (!userData) {
    notFound();
  }
  
  // 2. Fetch the template configuration that this user selected
  const template = await getTemplateById(userData.selectedTemplateId);
  
  if (!template) {
    notFound();
  }
  
  const { previewComponent: PreviewComponent, ...templateData } = template; 
  
  return (
    <>
      <header className="w-full bg-gray-50 px-6 py-4 shadow-sm">
        <TemplatePreviewHeader template={templateData} />
      </header>
      
      <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
        <main className="flex-1">
          <div className="my-6">
            {/* Pass BOTH template config AND user data */}
            <PreviewComponent 
              // Template styling
              colors={templateData.colors}
              fonts={templateData.fonts}
              fontSizes={templateData.fontSizes}
              social_style={templateData.social_style}
              connect_style={templateData.connect_style}
              profileStyle={templateData.profile_style}
              profileBorder={templateData.profile_border}
              profileSize={templateData.profile_size}
              
              // User's actual data
              profileData={{
                displayName: userData.displayName,
                location: userData.location,
                handle: userData.handle,
                bio: userData.bio,
                email: userData.email,
                profileImage: userData.profileImage,
                coverImage: userData.coverImage,
                socialLinks: userData.socialLinks,
              }}
            />
          </div>
          <div className="container mx-auto px-4 py-8">
            <TemplatePreviewContent template={templateData} />
          </div>
        </main>
        <div className="hidden lg:block w-1/3">
          <TemplatePreviewSidebar template={templateData} />
        </div>
      </div>
    </>
  );
}
