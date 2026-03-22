import { redirect } from 'next/navigation'

// Root redirect — send visitors to the demo page
export default function HomePage() {
  redirect('/home')
}
