export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <main className="flex h-screen justify-center">
            <div className="h-max w-full border-x border-slate-400 md:max-w-2xl">
                {children}
            </div>
        </main>
    );
};
