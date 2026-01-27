import { MenuToggle } from '../components/layout/MenuToggle';

interface PlaceholderProps {
    title: string;
}

export const PlaceholderPage = ({ title }: PlaceholderProps) => {
    return (
        <div className="flex flex-col min-h-[80vh]">
            <div className="flex items-center gap-3 mb-8">
                <MenuToggle />
                <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 pb-20">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 border border-zinc-700">
                    <span className="text-3xl">🚧</span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
                <p className="text-zinc-400 max-w-sm">
                    This feature is currently under development. Check back soon!
                </p>
            </div>
        </div>
    );
};
