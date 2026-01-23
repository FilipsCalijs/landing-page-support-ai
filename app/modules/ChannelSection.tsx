import Image from 'next/image';
import { channelLogos, getChannelActions } from './data';
import { Typography } from '@/components/ui/Typography';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Dictionary } from '@/app/[locale]/dictionaries';

export function ChannelSection({ dictionary }: { dictionary: Dictionary }) {
  const channelActions = getChannelActions(dictionary);

  return (
    <section
      id="channel"
      className="mt-32 w-full max-w-296 px-4 flex flex-col items-center"
    >
      {/* Title */}
      <Typography variant="h2" weight="bold">
        {dictionary.Main.Actions.title}
      </Typography>

      {/* Description */}
      <div className="mt-4 max-w-160 text-center">
        <Typography variant="body1">
          {dictionary.Main.Actions.description}
        </Typography>
      </div>

      {/* Channel logos */}
      <div className="flex items-center justify-center gap-12 mt-8">
        {channelLogos.map((logo) => (
          <div
            key={logo.id}
            className="w-12 h-12 relative grayscale opacity-80 hover:opacity-100 transition"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Action blocks */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-12">
        {channelActions.map((action) => (
          <Card
            key={action.id}
            variant="elevated"
            color='green50'
            className="flex flex-col items-start justify-start p-4 gap-4" 
            style={{ width: '224px', height: '200px' }} // fixed size
          >
            <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-xl">
              <ArrowRight className="w-5 h-5 text-green-700" />
            </div>
            <Typography variant="body2" className="text-start">
              {action.name}
            </Typography>
          </Card>
        ))}
      </div>
    </section>
  );
}
