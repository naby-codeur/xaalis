export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      {children}
    </div>
  );
}
