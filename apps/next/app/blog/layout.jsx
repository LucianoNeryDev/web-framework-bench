import Shell from "../../components/Shell";

export default function BlogLayout({ children }) {
  return <Shell current="/blog">{children}</Shell>;
}
