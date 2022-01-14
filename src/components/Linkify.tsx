import { Link } from '@chakra-ui/react'

type LinkifyProps = {
  textChild: any
}

const Linkify = ({ textChild }: LinkifyProps) => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi

  let urlText = ''
  const newText = String(textChild).replace(urlRegex, function (url: string) {
    urlText = url
    return '%s'
  })

  return (
    <>
      {newText.split('%s').map((t, i) => {
        if (newText.length > 0 && i === 1)
          return (
            <Link color="teal.500" key={`${urlText}-%{i}`} href={urlText}>
              {urlText}
            </Link>
          )

        return t
      })}
    </>
  )
}

export default Linkify
