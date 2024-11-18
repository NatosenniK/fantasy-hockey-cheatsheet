interface PlayerHeadshotProps {
    imageUrl?: string
    width: number
    height: number
    className?: string
}

export function PlayerHeadshot(props: PlayerHeadshotProps) {


    return (

        <div className={`rounded-full` + props.className ? props.className : ' '} style={{backgroundImage: props.imageUrl ? `url(${props.imageUrl})` : '', backgroundSize: 'cover', width: props.width, height: props.height}}>

        </div>
    )
}