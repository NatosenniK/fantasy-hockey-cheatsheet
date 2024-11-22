import { faHockeyPuck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export default function SiteLogo() {
	return (
		<Link href="/" className={`flex flex-row items-center leading-none text-white`}>
			<FontAwesomeIcon icon={faHockeyPuck} className="fa-fw min-w-8 min-h-8 max-h-8" />
			<p className={`text-[30px] hidden lg:block pl-2`}>Fantasy Hockey Cheatsheet</p>
		</Link>
	)
}
