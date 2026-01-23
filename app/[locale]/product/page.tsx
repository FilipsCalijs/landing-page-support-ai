// app/[locale]/product/page.tsx
import { getDictionary } from '../dictionaries';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <div className="p-5">
      <div className="mt-5 border border-gray-300 p-3 rounded">
        <h1 className="text-2xl font-bold mb-4">{dictionary.Main.Header.product}</h1>
        <p className="mb-4">{dictionary.Main.Hero.description}</p>
        
        <h3 className="font-bold mb-2">Features:</h3>
        <ul className="list-disc ml-5 mb-4">
          <li>{dictionary.Main.Cards.BadgeAfter.feature1}</li>
          <li>{dictionary.Main.Cards.BadgeAfter.feature2}</li>
          <li>{dictionary.Main.Cards.BadgeAfter.feature3}</li>
        </ul>
        
        <div className="flex gap-4">
          <Button variant="primary" size="lg">
            {dictionary.Main.Hero.demo}
          </Button>
          <Button variant="outline" size="lg">
            {dictionary.Main.Hero.contactUs}
          </Button>
        </div>
      </div>
    </div>
  );
}