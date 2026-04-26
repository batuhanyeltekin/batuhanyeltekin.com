import SubpageLayout from "@/components/layout/SubpageLayout";
import UnderConstruction from "@/components/UnderConstruction";

export default function BlogPage() {
  return (
    <SubpageLayout currentPath="blog">
      <UnderConstruction pageName="blog" />
    </SubpageLayout>
  );
}
