import SubpageLayout from "@/components/layout/SubpageLayout";
import UnderConstruction from "@/components/UnderConstruction";

export default function ProjectsPage() {
  return (
    <SubpageLayout currentPath="projects">
      <UnderConstruction pageName="projects" />
    </SubpageLayout>
  );
}
