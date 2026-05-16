import Image from "next/image";
import { HeaderMenuItem } from "../../model";

type MenuProps = {
    items: HeaderMenuItem[];
};

const Icon = ({ item }: { item: HeaderMenuItem }) => {
    if (item.id === "events") {
        return (
            <span className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={22}
                    height={22}
                    className="absolute left-1/2 top-1/2 h-22 w-22 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
        );
    }

    if (item.id === "autoSeed") {
        return (
            <span className="relative h-24 w-24 shrink-0 overflow-hidden">
                <Image
                    src={item.icon}
                    alt={item.iconAlt}
                    width={20}
                    height={20}
                    className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
                />
            </span>
        );
    }

    return (
        <span className="relative h-24 w-24 shrink-0 overflow-hidden">
            <Image
                src={item.icon}
                alt={item.iconAlt}
                width={20}
                height={20}
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2"
            />
            {item.iconOverlay ? (
                <Image
                    src={item.iconOverlay}
                    alt=""
                    aria-hidden="true"
                    width={17}
                    height={13}
                    className="absolute left-2 top-[5.6px] h-13 w-17"
                />
            ) : null}
        </span>
    );
};

export const Menu = ({ items }: MenuProps) => {
    return (
        <nav aria-label="Основное меню" className="shrink-0">
            <ul className="flex items-center justify-end gap-12">
                {items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noreferrer noopener" : undefined}
                            className="flex items-center gap-8 p-8 transition-opacity hover:opacity-80"
                        >
                            <Icon item={item} />
                            <span className="font-manrope text-[16px] font-medium leading-22 whitespace-nowrap text-header-nav-text">
                                {item.label}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
