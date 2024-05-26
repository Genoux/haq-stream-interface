// pages/index.js

export async function getServerSideProps(context: any) {
  return {
    redirect: {
      destination: '/rooms/',
      permanent: false, // Set to true if this redirect will always be in place
    }
  };
}

export default function Home() {
  return <div>Redirecting...</div>;
}
