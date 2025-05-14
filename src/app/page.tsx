import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // redirect() throws an error, so this is not strictly necessary but good practice
}
