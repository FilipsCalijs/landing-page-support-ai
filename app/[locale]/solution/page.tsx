// app/[locale]/about-product/page.tsx
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AboutProductPage() {
  const t = useTranslations('About');

  return (
    <div className="p-5">
      <div className="mt-5 border border-gray-300 p-3 rounded">
        <h3 className="font-bold">{t('specs.heading')}</h3>
        <ul className="list-disc ml-5 mb-4">
          <li>{t('specs.feature1')}</li>
          <li>{t('specs.feature2')}</li>
        </ul>
        
        
        <Button variant="primary">
            solution
        </Button>
        <Card>
            bibi
        </Card>
      </div>
    </div>
  );
}