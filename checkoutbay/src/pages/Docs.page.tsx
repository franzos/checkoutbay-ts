import { Container } from "@mantine/core";
import { LargeTitleWithText } from '@gofranz/common-components';
import { Docs } from '../components/Docs';
import { Footer } from '../components/Layout/Footer';

export function DocsPage() {
  return (
    <>
      <Container mt="xl" mb="xl">
        <LargeTitleWithText
          title="Docs"
          text="Get started with Checkoutbay, the complete e-commerce platform for managing your online store. Learn how to integrate, customize, and utilize advanced features."
          mb="xl"
        />
        <Docs />

      </Container>
      <Footer />
    </>
  );
}