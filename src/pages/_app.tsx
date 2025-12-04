import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../components/layouts/MainLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const currentPath = router.pathname;
  const hidefooterHeader =
    currentPath === "/admin/dashboard" ||
    currentPath === "/admin/content" ||
    currentPath === "/admin/pengumuman" ||
    currentPath === "/admin/berkas" ||
    currentPath === "/login" ||
    currentPath === "/admin/strukturOrganisasi" ||
    currentPath === "/admin/berita"||
    currentPath === "/admin/dosen" ||
    currentPath === "/admin/prodi"||
    currentPath === "/admin/faq"||
    currentPath === "/viewer/[id]";

  return (
    <MainLayout
      hideFooter={hidefooterHeader}
      hideHeader={hidefooterHeader}
      hideContactHeader={hidefooterHeader}
    >
      <Component {...pageProps} />
    </MainLayout>
  );
}
