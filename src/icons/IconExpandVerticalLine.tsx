import {FC, PropsWithoutRef, SVGProps} from 'react'

const IconExpandVerticalLine: FC<PropsWithoutRef<SVGProps<SVGElement>>> = (props) => {
  return (
    <svg
      fill="currentColor"
      height={'1em'}
      viewBox="0 0 24 24"
      width={'1em'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M11.9995 0.499512L16.9493 5.44926L15.535 6.86347L12.9995 4.32794V9.99951H10.9995L10.9995 4.32794L8.46646 6.86099L7.05225 5.44678L11.9995 0.499512ZM10.9995 13.9995L10.9995 19.6704L8.46451 17.1353L7.05029 18.5496L12 23.4995L16.9497 18.5498L15.5355 17.1356L12.9995 19.6716V13.9995H10.9995Z"></path>
    </svg>
  )
}

export default IconExpandVerticalLine