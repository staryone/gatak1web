import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

export default function FooterMain() {
  return (
    <Footer container>
      <FooterCopyright href="#" by="Gatak 1™" year={2025} />
      <FooterLinkGroup>
        <FooterLink href="#">Profil Dusun</FooterLink>
        <FooterLink href="#">Berita</FooterLink>
        <FooterLink href="#">Galeri</FooterLink>
        <FooterLink href="#">Kontak</FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
}
