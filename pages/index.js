// Import the necessary modules from their respective files
import React from "react"; // React library, used for building the user interface
import Layout from "@/components/common/Layout"; // Layout component, used as a wrapper for the page

// Define the Home component
export default function Home() {
  // The component returns the Layout component wrapping the main content of the page
  return (
    // The Layout component is used here as a wrapper for the page content
    <Layout>
      {/* The main tag is used to wrap the main content of the document. 
      In this case, it contains a heading with the text "Home". 
      The className attribute is used to apply styles to the element. */}
      <main className="landing text-slate-50">
        <h1>Home</h1>
      </main>
    </Layout>
  );
}