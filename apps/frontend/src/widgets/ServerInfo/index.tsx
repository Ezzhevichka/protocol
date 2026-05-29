import { Text } from 'shared/ui';

type ServerInfoProps = {
  badge: string;
  title: string;
  mapName: string;
  className?: string;
};

export function ServerInfo({ badge, title, mapName, className = '' }: ServerInfoProps) {
  return (
    <section className={`flex w-274 flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-8">
        <Text
          as="p"
          size="sm"
          weight="medium"
          className="font-manrope leading-16 tracking-[0.28px]"
          style={{ color: '#FAFAFA' }}
        >
          {badge}
        </Text>
        <Text
          as="p"
          weight="semibold"
          className="max-w-200 font-manrope text-[20px] leading-32 tracking-[0.4px] text-fraction-card-text-primary"
        >
          {title}
        </Text>
      </div>
      <Text
        as="p"
        size="base"
        weight="medium"
        className="font-manrope leading-22"
        style={{ color: '#A1A1A1' }}
      >
        {mapName}
      </Text>
    </section>
  );
}
