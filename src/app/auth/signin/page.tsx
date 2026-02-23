import SignInPage from '@/components/SignInPage';
import Loading from '@/components/ui/Loading';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SignInPage />
    </Suspense>
  );
}
