import SiteLayout from "@/components/site/SiteLayout";
import { ButtonLink, Container, Eyebrow } from "@/components/site/primitives";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  usePageMeta({ path: "/404", title: "Page not found — Chadi Troudi", description: "This page doesn't exist. See my work, experience or contact details instead." });

  return (
    <SiteLayout>
      <Container className="py-24 text-center sm:py-32">
        <Eyebrow>404</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">This page doesn't exist.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">The link may be out of date. Here's where most visitors are headed:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/projects">See my work</ButtonLink>
          <ButtonLink variant="secondary" to="/contact">
            Contact me
          </ButtonLink>
          <ButtonLink variant="ghost" to="/">
            Home
          </ButtonLink>
        </div>
      </Container>
    </SiteLayout>
  );
};

export default NotFound;
