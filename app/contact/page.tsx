import Link from 'next/link';

export const metadata = {
  title: 'Contact | GeekFut',
  description: 'Get in touch, report bugs, or request features for GeekFut.',
};

export default function ContactPage() {
  return (
    <main className="flex-1 flex flex-col p-6 md:p-12 relative z-10 w-full max-w-4xl mx-auto animate-fade-in-up mt-8">
      
      {/* Header Section */}
      <div className="mb-12">
        <h2 className="text-gfg-green font-semibold tracking-widest text-sm uppercase mb-2">Contact</h2>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white uppercase tracking-tight drop-shadow-md">
          Get in Touch
        </h1>
        <p className="text-gray-300 font-body mt-6 text-lg max-w-2xl leading-relaxed">
          Got a bug, a feature idea, or just want to say hi? The best way to reach out is through GitHub — it keeps everything in one place and public so others benefit too.
        </p>
      </div>

      <div className="space-y-12">
        {/* Report Bug Section */}
        <section>
          <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide mb-4 border-b border-white/10 pb-2 inline-block">
            Report a bug or request a feature
          </h3>
          <p className="text-gray-400 font-body text-base max-w-3xl leading-relaxed">
            Open an issue on the repository:{' '}
            <a 
              href="https://github.com/anuj-pisal/GeekFut/issues" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gfg-green hover:text-emerald-400 underline underline-offset-4 transition-colors"
            >
              github.com/anuj-pisal/GeekFut/issues
            </a>
            . Include your username, what you expected, and what happened — screenshots help.
          </p>
        </section>

        {/* The Makers Section */}
        <section>
          <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide mb-4 border-b border-white/10 pb-2 inline-block">
            The Makers
          </h3>
          <p className="text-gray-400 font-body text-base mb-4">
            You can also reach the people who built GeekFut directly on GitHub or via email:
          </p>
          <ul className="space-y-3 font-body">
            <li className="flex items-center gap-3 before:content-['•'] before:text-gfg-green before:font-bold">
              <span className="text-gray-300 font-medium w-20">LinkedIn:</span>
              <a 
                href="https://www.linkedin.com/in/anuj-pisal-335809272/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gfg-green hover:text-emerald-400 underline underline-offset-4 transition-colors font-medium truncate"
              >
                Anuj Pisal
              </a>
            </li>
            <li className="flex items-center gap-3 before:content-['•'] before:text-gfg-green before:font-bold">
              <span className="text-gray-300 font-medium w-20">Email:</span>
              <a 
                href="mailto:anujpisal69@gmail.com" 
                className="text-gfg-green hover:text-emerald-400 underline underline-offset-4 transition-colors font-medium"
              >
                anujpisal69@gmail.com
              </a>
            </li>
          </ul>
        </section>

        {/* Star the Project Section */}
        <section>
          <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide mb-4 border-b border-white/10 pb-2 inline-block">
            Star the Project
          </h3>
          <p className="text-gray-400 font-body text-base">
            If GeekFut made you smile, a star on{' '}
            <a 
              href="https://github.com/anuj-pisal/GeekFut" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gfg-green hover:text-emerald-400 underline underline-offset-4 transition-colors font-medium"
            >
              GitHub
            </a>{' '}
            genuinely helps it reach more people. Thank you.
          </p>
        </section>
      </div>
    </main>
  );
}
