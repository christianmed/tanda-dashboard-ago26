import { getTandaData } from '@/lib/dataFetcher';
import DashboardContainer from '@/components/DashboardContainer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page() {
  const initialData = await getTandaData();

  return <DashboardContainer initialData={initialData} />;
}
