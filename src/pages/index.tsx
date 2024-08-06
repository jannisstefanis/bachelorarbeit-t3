import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/todo">
        <p>Todo</p>
      </Link>
    </>
  );
}
