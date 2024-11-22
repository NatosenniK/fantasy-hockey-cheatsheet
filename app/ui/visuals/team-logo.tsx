import Image from 'next/image'

interface NHLTeamLogoProps {
	imageUrl: string
	width: number
	height: number
	alt: string
	className?: string
}

export default function NHLTeamLogo(props: NHLTeamLogoProps) {
	return (
		<div className={`flex flex-row items-center leading-none text-white`}>
			<Image
				src={props.imageUrl}
				width={props.width}
				height={props.height}
				className={`${props.className ? props.className : ''}`}
				alt={`${props.alt} logo`}
			/>
		</div>
	)
}
