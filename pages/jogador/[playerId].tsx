import { useEffect, useState } from 'react'
import { Navbar } from '../../components/navbar'
import Cookie from 'js-cookie'
import { addDays, parseISO, getYear, differenceInYears } from 'date-fns'
import getConfig from 'next/config'
import Image from 'next/image'
import { generateRankString } from '../../services/generateRankString'
import { useRouter } from 'next/router'

function openLeagueAccountModal() {
  document.querySelector('html').classList.add('is-clipped')
  document.querySelector('.modal').classList.add('is-active')
}

function closeLeagueAccountModal() {
  document.querySelector('html').classList.remove('is-clipped')
  document.querySelector('.modal').classList.remove('is-active')
}

async function fetchUser(userId) {
  const response = await fetch(`/api/users/${userId}`)
  return await response.json()
}

async function fetchStates() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  return await response.json()
}

async function fetchCities(state) {
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`)
  return await response.json()
}

function showOnlyInput(attributeName) {
  document.querySelector(`#${attributeName}`).classList.add('is-hidden')
  document.querySelector(`#${attributeName}-cancel`).classList.add('is-hidden')
  document.querySelector(`#${attributeName}-form`).classList.remove('is-hidden')
}

function genderText(genderChar) {
  switch (genderChar) {
    case 'M':
      return 'Masculino'
    case 'F':
      return 'Feminino'
    case 'O':
      return 'Outro'
    default:
      break
  }
}

function generateProfileIconId(profileIconId) {
  let randomId = Math.floor(Math.random() * 29)

  while (randomId === profileIconId) {
    randomId = Math.floor(Math.random() * 29)
  }

  return randomId
}

export default function Index() {
  const router = useRouter()
  const { playerId } = router.query

  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState('Top')
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [age, setAge] = useState('')
  const [date, setDate] = useState({ day: '1', month: '1', year: '2009' })
  const [states, setStates] = useState([])
  const [state, setState] = useState('RO')
  const [cities, setCities] = useState([])
  const [city, setCity] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [setupPhoto, setSetupPhoto] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [rg, setRg] = useState('')
  const [cpf, setCpf] = useState('')
  const [address, setAddress] = useState('')
  const [twitter, setTwitter] = useState('')
  const [twitch, setTwitch] = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [gender, setGender] = useState('M')
  const [leagueAccount, setLeagueAccount] = useState({
    id: '',
    accountId: '',
    puuid: '',
    name: '',
    profileIconId: 1,
    confirmationIconId: 1,
    leaguePoints: 0,
    wins: 0,
    losses: 0,
    tier: '',
    rank: '',
  })

  useEffect(() => {
    document.querySelector('body').classList.add('has-navbar-fixed-top')
    document.querySelector('html').style.backgroundColor = 'black'

    if (playerId) {
      fetchUser(playerId).then(async (profile) => {
        if (profile.errors) {
          window.location.href = '/'
        } else {
          setProfile(profile)
          setName(profile.name)
          setRole(profile.player.role)
          setEmail(profile.email)
          setGender(profile.gender)
          setBirthDate(profile.birthDate.toString())
          setState(profile.player.state)
          setCity(profile.player.city)
          setProfilePicture(profile.player.profilePicture)
          setSetupPhoto(profile.player.setupPhoto)
          setWhatsapp(profile.whatsapp)
          setAddress(profile.player.address)
          setTwitch(profile.twitch)
          setTwitter(profile.twitter)
          setInstagram(profile.instagram)
          setFacebook(profile.facebook)

          document.querySelector('#loading').classList.add('is-hidden')
          document.querySelector('#page').classList.remove('is-hidden')
        }
      })
    }
  }, [playerId])

  useEffect(() => {
    const date = parseISO(birthDate)
    const numberAge = differenceInYears(new Date(), date)

    setDate({ day: date.getDate().toString(), month: (date.getMonth() + 1).toString(), year: getYear(date).toString() })
    setAge(`${numberAge} anos`)
  }, [birthDate])

  const minYear = new Date().getFullYear() - 12
  const maxYear = new Date().getFullYear() - 100
  const yearOptions = []

  for (let year = minYear; year > maxYear; year--) {
    yearOptions.push(
      <option value={year} key={year}>
        {year}
      </option>
    )
  }

  return (
    <div className='has-text-weight-bold'>
      <Navbar />

      <div className='is-flex is-justify-content-center mt-5 is-hidden' id='page'>
        <div className='is-flex is-flex-direction-column is-justify-content-center'>
          <button
            className='button is-large is-focused is-primary'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            id='player-card-button'
            onClick={() => {
              document.querySelector('#information-card').classList.add('is-hidden')
              document.querySelector('#social-media-card').classList.add('is-hidden')
              document.querySelector('#smurfs-card').classList.add('is-hidden')

              document.querySelector('#player-card').classList.remove('is-hidden')
            }}
          >
            Perfil
          </button>

          {/* <button
            className='button is-large mt-5 is-primary is-hidden'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => {
              document.querySelector('#player-card-button').classList.remove('is-focused')

              document.querySelector('#player-card').classList.add('is-hidden')
              document.querySelector('#social-media-card').classList.add('is-hidden')
              document.querySelector('#smurfs-card').classList.add('is-hidden')

              document.querySelector('#information-card').classList.remove('is-hidden')
            }}
          >
            Dados pessoais
          </button> */}

          <button
            className='button is-large mt-5 is-primary'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => {
              document.querySelector('#player-card-button').classList.remove('is-focused')

              document.querySelector('#player-card').classList.add('is-hidden')
              document.querySelector('#information-card').classList.add('is-hidden')
              document.querySelector('#smurfs-card').classList.add('is-hidden')

              document.querySelector('#social-media-card').classList.remove('is-hidden')
            }}
          >
            Redes sociais
          </button>

          {/* <button
            className='button is-large mt-5 is-primary'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => {
              document.querySelector('#player-card-button').classList.remove('is-focused')

              document.querySelector('#player-card').classList.add('is-hidden')
              document.querySelector('#information-card').classList.add('is-hidden')
              document.querySelector('#social-media-card').classList.add('is-hidden')

              document.querySelector('#smurfs-card').classList.remove('is-hidden')
            }}
          >
            Smurfs
          </button> */}
          {/* <button
            className='button is-large mt-5 is-primary'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            disabled
          >
            Histórico
          </button>
          <button
            className='button is-large mt-5 is-primary'
            style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            disabled
          >
            Conquistas
          </button> */}
        </div>

        <div
          className='card'
          style={{ backgroundColor: 'white', height: '49rem', width: '61rem', marginRight: '12rem' }}
        >
          <div className='card-content' id='player-card'>
            <div className='content'>
              <div className='is-flex'>
                <figure
                  className={`image ml-0 mt-0 mb-5 is-flex is-flex-direction-column is-justify-content-center has-background-grey-lighter ${
                    profile && profile.player.profilePicture ? '' : 'is-hidden'
                  }`}
                  style={{
                    width: '20rem',
                    minWidth: '20rem',
                    height: '20rem',
                  }}
                  id='profile-picture'
                >
                  <img src={`${profilePicture}`} style={{ maxHeight: '20rem' }} />
                </figure>

                <div className='ml-4'>
                  <h1
                    className={`title ml-0 mr-0 mb-0 is-1 is-flex is-align-items-center ${
                      profile && profile.player.leagueAccounts[0].nickname ? '' : 'is-hidden'
                    }`}
                    style={{ fontSize: '4rem', marginTop: '-1rem', textTransform: 'none' }}
                    id='player-nick'
                  >
                    {profile && profile.player.leagueAccounts[0].nickname}
                  </h1>

                  <h1 className='title' id='name'>
                    {profile && profile.name}
                  </h1>

                  <h1 className='title mt-1' id='role'>
                    {profile && profile.player.role}
                  </h1>

                  {/* TODO: Time/Free agent */}
                  {/* <h1 className='title mt-1'>
                    <a href=''>paiN Gaming</a>
                  </h1> */}
                </div>
              </div>

              <div className='columns'>
                <div className='column pt-0'>
                  <label className='label mt-3' style={{ fontWeight: 'bolder' }}>
                    E-mail
                  </label>

                  <h1 className='title is-4 mt-0' id='email'>
                    {profile && profile.email}
                  </h1>

                  <label className='label' style={{ fontWeight: 'bolder' }}>
                    Gênero
                  </label>

                  <h1 className='title is-4 mt-0' id='gender'>
                    {profile && genderText(profile.gender)}
                  </h1>

                  <label className='label' style={{ fontWeight: 'bolder' }}>
                    Idade
                  </label>

                  <h1 className='title is-4 mt-0' id='age'>
                    {age}
                  </h1>

                  <label className='label' style={{ fontWeight: 'bolder' }}>
                    Estado
                  </label>

                  <h1 className='title is-4 mt-0' id='state'>
                    {profile && profile.player.state}
                  </h1>

                  <label className='label' style={{ fontWeight: 'bolder' }}>
                    Cidade
                  </label>

                  <h1 className='title is-4 mt-0' id='city'>
                    {profile && profile.player.city}
                  </h1>
                </div>

                <div
                  className={`column has-text-centered ${
                    profile && profile.player.leagueAccounts[0] ? '' : 'is-invisible'
                  }`}
                >
                  <h1 className='mb-0'>{profile && generateRankString(profile.player.leagueAccounts[0])}</h1>

                  <div className='is-flex is-justify-content-center grow-hover'>
                    {profile && profile.player.leagueAccounts[0].tier && (
                      <a
                        href={`https://br.op.gg/summoner/userName=${
                          profile && encodeURIComponent(profile.player.leagueAccounts[0].nickname)
                        }`}
                      >
                        <figure
                          className='image ml-0 mt-0 mr-0'
                          style={{
                            minWidth: '288px',
                            minHeight: '329.0625px',
                          }}
                        >
                          <Image src={`/elo/${profile && profile.player.leagueAccounts[0].tier}.png`} layout='fill' />
                        </figure>
                      </a>
                    )}
                  </div>

                  {profile &&
                    profile.player.leagueAccounts[0].tier !== 'UNRANKED' &&
                    (profile.player.leagueAccounts[0].wins || profile.player.leagueAccounts[0].losses) && (
                      <p className='is-size-5'>
                        {profile.player.leagueAccounts[0].wins}W/
                        {profile.player.leagueAccounts[0].losses}L
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div
            className='card-content is-hidden is-flex is-flex-direction-column is-justify-content-center'
            id='information-card'
            style={{ height: '50rem' }}
          >
            <div className='content'>
              <div className='is-flex'>
                <div className='is-flex is-flex-direction-column is-justify-content-center'>
                  <form
                    style={{
                      width: '20rem',
                      minWidth: '20rem',
                      height: '20rem',
                    }}
                    className={`is-flex is-flex-direction-column is-justify-content-center pl-6 pr-6 pb-6 mb-5 ml-6 mr-6 ${
                      profile && profile.player.setupPhoto ? 'is-hidden' : ''
                    }`}
                    id='setup-photo-form'
                    onSubmit={(event) => {
                      event.preventDefault()
                      const button = document.querySelector('#setup-photo-save') as HTMLButtonElement
                      button.disabled = true
                      button.classList.add('is-loading')

                      const form = document.querySelector('#setup-photo-form') as HTMLFormElement
                      const setupPhoto = document.querySelector('#setup-photo')

                      const fileInput = document.querySelector('#setup-photo-input') as HTMLInputElement

                      if (fileInput.files.length > 0) {
                        const file = fileInput.files[0]

                        const { publicRuntimeConfig } = getConfig()
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('upload_preset', publicRuntimeConfig.CLOUDINARY_UPLOAD_PRESET)

                        fetch(publicRuntimeConfig.CLOUDINARY_URL, {
                          method: 'POST',
                          body: formData,
                        })
                          .then((response) => response.json())
                          .then(async (data) => {
                            if (data.secure_url !== '') {
                              await fetch(`/api/players/${profile.player._id}`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ setupPhoto: data.secure_url }),
                              })

                              form.classList.add('is-hidden')
                              setupPhoto.classList.remove('is-hidden')
                            }

                            setSetupPhoto(data.secure_url)

                            button.disabled = false
                            button.classList.remove('is-loading')
                          })
                          .catch((err) => {
                            console.error(err)
                            button.disabled = false
                            button.classList.remove('is-loading')
                          })
                      }
                    }}
                  >
                    <div className='file is-centered is-boxed is-primary has-name'>
                      <label className='file-label'>
                        <input
                          className='file-input'
                          type='file'
                          name='resume'
                          id='setup-photo-input'
                          onChange={() => {
                            const fileInput = document.querySelector('#setup-photo-input') as HTMLInputElement

                            if (fileInput.files.length > 0) {
                              const fileName = document.querySelector('#setup-photo-name')
                              fileName.textContent = fileInput.files[0].name
                            }
                          }}
                        />
                        <span className='file-cta'>
                          <span className='file-icon'>
                            <svg
                              aria-hidden='true'
                              focusable='false'
                              data-prefix='fas'
                              data-icon='upload'
                              role='img'
                              xmlns='http://www.w3.org/2000/svg'
                              viewBox='0 0 512 512'
                              className='svg-inline--fa fa-upload fa-w-16 fa-3x'
                            >
                              <path
                                fill='currentColor'
                                d='M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'
                                className=''
                              />
                            </svg>
                          </span>
                          <span className='file-label'>Foto do setup</span>
                        </span>
                        <span id='setup-photo-name' className='file-name'>
                          Escolha a foto do setup
                        </span>
                      </label>
                    </div>

                    <div className='field is-grouped is-grouped-centered mt-2'>
                      <div className='control'>
                        <button className='button is-primary' id='setup-photo-save'>
                          Salvar
                        </button>
                      </div>
                      <div className='control'>
                        <button
                          type='button'
                          className='button is-hidden'
                          id='setup-photo-cancel'
                          onClick={() => {
                            document.querySelector('#setup-photo-form').classList.add('is-hidden')
                            document.querySelector('#setup-photo').classList.remove('is-hidden')
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>

                  <figure
                    className={`image ml-0 mt-0 mb-5 is-flex is-flex-direction-column is-justify-content-center has-background-grey-lighter ${
                      profile && profile.player.setupPhoto ? '' : 'is-hidden'
                    }`}
                    style={{
                      width: '28rem',
                      minWidth: '20rem',
                      height: '28rem',
                    }}
                    onClick={() => {
                      document.querySelector('#setup-photo').classList.add('is-hidden')
                      document.querySelector('#setup-photo-cancel').classList.remove('is-hidden')
                      document.querySelector('#setup-photo-form').classList.remove('is-hidden')
                    }}
                    id='setup-photo'
                  >
                    <img src={`${setupPhoto}`} />
                  </figure>
                </div>

                <div className='is-flex is-flex-direction-column is-justify-content-center'>
                  <label className='label'>Whatsapp</label>

                  <h1
                    className='title is-4 mt-0'
                    id='whatsapp'
                    onClick={() => {
                      document.querySelector('#whatsapp').classList.add('is-hidden')
                      document.querySelector('#whatsapp-form').classList.remove('is-hidden')
                    }}
                  >
                    {profile && profile.whatsapp}
                  </h1>

                  <form
                    id='whatsapp-form'
                    className='is-hidden is-flex mb-3'
                    onSubmit={async (event) => {
                      event.preventDefault()

                      const button = document.querySelector('#whatsapp-save') as HTMLButtonElement
                      button.disabled = true
                      button.classList.add('is-loading')

                      await fetch(`/api/users/${profile._id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ whatsapp }),
                      })

                      setProfile({ ...profile, whatsapp })

                      document.querySelector('#whatsapp-form').classList.add('is-hidden')
                      document.querySelector('#whatsapp').classList.remove('is-hidden')

                      button.disabled = false
                      button.classList.remove('is-loading')
                    }}
                  >
                    <input
                      type='text'
                      className='input'
                      placeholder='Digite seu WhatsApp'
                      value={whatsapp}
                      autoFocus
                      onChange={(event) => setWhatsapp(event.target.value)}
                    />

                    <button className='button is-primary ml-2' id='whatsapp-save'>
                      Salvar
                    </button>

                    <button
                      className='button ml-2'
                      type='button'
                      onClick={() => {
                        document.querySelector('#whatsapp-form').classList.add('is-hidden')
                        document.querySelector('#whatsapp').classList.remove('is-hidden')
                      }}
                    >
                      Cancelar
                    </button>
                  </form>

                  {/* <label className='label'>RG</label>

                  <h1
                    className={`title is-4 mt-0 ${profile && profile.player.rg ? '' : 'is-hidden'}`}
                    style={{ cursor: 'pointer' }}
                    id='rg'
                    onClick={() => {
                      document.querySelector('#rg').classList.add('is-hidden')
                      document.querySelector('#rg-form').classList.remove('is-hidden')
                      document.querySelector('#rg-cancel').classList.remove('is-hidden')
                    }}
                  >
                    {profile && profile.player.rg}
                  </h1>

                  <form
                    id='rg-form'
                    className={`is-flex mb-3 ${profile && profile.player.rg ? 'is-hidden' : ''}`}
                    onSubmit={async (event) => {
                      event.preventDefault()

                      const button = document.querySelector('#rg-save') as HTMLButtonElement
                      button.disabled = true
                      button.classList.add('is-loading')

                      await fetch(`/api/players/${profile.player._id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ rg }),
                      })

                      setProfile({ ...profile, player: { ...profile.player, rg } })

                      document.querySelector('#rg-form').classList.add('is-hidden')
                      document.querySelector('#rg').classList.remove('is-hidden')

                      button.disabled = false
                      button.classList.remove('is-loading')
                    }}
                  >
                    <input
                      type='text'
                      className='input'
                      placeholder='Digite seu RG'
                      value={rg}
                      autoFocus
                      onChange={(event) => setRg(event.target.value)}
                    />

                    <button className='button is-primary ml-2' id='rg-save'>
                      Salvar
                    </button>

                    <button
                      className='button ml-2 is-hidden'
                      type='button'
                      id='rg-cancel'
                      onClick={() => {
                        document.querySelector('#rg-form').classList.add('is-hidden')
                        document.querySelector('#rg').classList.remove('is-hidden')
                      }}
                    >
                      Cancelar
                    </button>
                  </form>

                  <label className='label'>CPF</label>

                  <h1
                    className={`title is-4 mt-0 ${profile && profile.player.cpf ? '' : 'is-hidden'}`}
                    style={{ cursor: 'pointer' }}
                    id='cpf'
                    onClick={() => {
                      document.querySelector('#cpf').classList.add('is-hidden')
                      document.querySelector('#cpf-form').classList.remove('is-hidden')
                      document.querySelector('#cpf-cancel').classList.remove('is-hidden')
                    }}
                  >
                    {profile && profile.player.cpf}
                  </h1>

                  <form
                    id='cpf-form'
                    className={`is-flex mb-3 ${profile && profile.player.cpf ? 'is-hidden' : ''}`}
                    onSubmit={async (event) => {
                      event.preventDefault()

                      const button = document.querySelector('#cpf-save') as HTMLButtonElement
                      button.disabled = true
                      button.classList.add('is-loading')

                      await fetch(`/api/players/${profile.player._id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ cpf }),
                      })

                      setProfile({ ...profile, player: { ...profile.player, cpf } })

                      document.querySelector('#cpf-form').classList.add('is-hidden')
                      document.querySelector('#cpf').classList.remove('is-hidden')

                      button.disabled = false
                      button.classList.remove('is-loading')
                    }}
                  >
                    <input
                      type='text'
                      className='input'
                      placeholder='Digite seu CPF'
                      value={cpf}
                      autoFocus
                      onChange={(event) => setCpf(event.target.value)}
                    />

                    <button className='button is-primary ml-2' id='cpf-save'>
                      Salvar
                    </button>

                    <button
                      className='button ml-2 is-hidden'
                      type='button'
                      id='cpf-cancel'
                      onClick={() => {
                        document.querySelector('#cpf-form').classList.add('is-hidden')
                        document.querySelector('#cpf').classList.remove('is-hidden')
                      }}
                    >
                      Cancelar
                    </button>
                  </form> */}

                  <label className='label'>Endereço</label>

                  <h1
                    className={`title is-4 mt-0 ${profile && profile.player.address ? '' : 'is-hidden'}`}
                    id='address'
                    onClick={() => {
                      document.querySelector('#address').classList.add('is-hidden')
                      document.querySelector('#address-form').classList.remove('is-hidden')
                      document.querySelector('#address-cancel').classList.remove('is-hidden')
                    }}
                  >
                    {profile && profile.player.address}
                  </h1>

                  <form
                    id='address-form'
                    className={`is-flex mb-3 ${profile && profile.player.address ? 'is-hidden' : ''}`}
                    onSubmit={async (event) => {
                      event.preventDefault()

                      const button = document.querySelector('#address-save') as HTMLButtonElement
                      button.disabled = true
                      button.classList.add('is-loading')

                      await fetch(`/api/players/${profile.player._id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ address }),
                      })

                      setProfile({ ...profile, player: { ...profile.player, address } })

                      document.querySelector('#address-form').classList.add('is-hidden')
                      document.querySelector('#address').classList.remove('is-hidden')

                      button.disabled = false
                      button.classList.remove('is-loading')
                    }}
                  >
                    <input
                      type='text'
                      className='input'
                      placeholder='Digite seu endereço'
                      value={address}
                      autoFocus
                      onChange={(event) => setAddress(event.target.value)}
                      style={{ width: '17rem' }}
                    />

                    <button className='button is-primary ml-2' id='address-save'>
                      Salvar
                    </button>

                    <button
                      className='button ml-2 is-hidden'
                      type='button'
                      id='address-cancel'
                      onClick={() => {
                        document.querySelector('#address-form').classList.add('is-hidden')
                        document.querySelector('#address').classList.remove('is-hidden')
                      }}
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div
            className='card-content is-hidden is-flex is-flex-direction-column is-justify-content-space-between'
            id='social-media-card'
            style={{ height: '49rem' }}
          >
            <section className='hero is-small'>
              <div className='hero-body'>
                <div className='is-flex'>
                  <div>
                    <figure className='image is-96x96 mr-5'>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='twitter'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 512 512'
                        className='svg-inline--fa fa-twitter fa-w-16 fa-3x'
                      >
                        <path
                          fill='currentColor'
                          d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                          className=''
                        />
                      </svg>
                    </figure>
                  </div>

                  <div style={{ width: '48rem' }}>
                    <p className='title'>Twitter</p>

                    <p className={`subtitle mt-5 ${profile && profile.twitter ? '' : 'is-hidden'}`} id='twitter'>
                      <a href={`${profile && profile.twitter}`}>{profile && profile.twitter}</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className='hero is-small'>
              <div className='hero-body'>
                <div className='is-flex'>
                  <div>
                    <figure className='image is-96x96 mr-5'>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='twitch'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 512 512'
                        className='svg-inline--fa fa-twitch fa-w-16 fa-3x'
                      >
                        <path
                          fill='currentColor'
                          d='M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z'
                          className=''
                        />
                      </svg>
                    </figure>
                  </div>

                  <div style={{ width: '48rem' }}>
                    <p className='title'>Twitch</p>

                    <p className={`subtitle mt-5 ${profile && profile.twitch ? '' : 'is-hidden'}`} id='twitch'>
                      <a href={`${profile && profile.twitch}`}>{profile && profile.twitch}</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className='hero is-small'>
              <div className='hero-body'>
                <div className='is-flex'>
                  <div>
                    <figure className='image is-96x96 mr-5'>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='instagram'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 448 512'
                        className='svg-inline--fa fa-instagram fa-w-14 fa-3x'
                      >
                        <path
                          fill='currentColor'
                          d='M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z'
                          className=''
                        />
                      </svg>
                    </figure>
                  </div>

                  <div style={{ width: '48rem' }}>
                    <p className='title'>Instagram</p>
                    <p className={`subtitle mt-5 ${profile && profile.instagram ? '' : 'is-hidden'}`} id='instagram'>
                      <a href={`${profile && profile.instagram}`}>{profile && profile.instagram}</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className='hero is-small'>
              <div className='hero-body'>
                <div className='is-flex'>
                  <div>
                    <figure className='image is-96x96 mr-5'>
                      <svg
                        aria-hidden='true'
                        focusable='false'
                        data-prefix='fab'
                        data-icon='facebook'
                        role='img'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 512 512'
                        className='svg-inline--fa fa-facebook fa-w-16 fa-3x'
                      >
                        <path
                          fill='currentColor'
                          d='M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z'
                          className=''
                        />
                      </svg>
                    </figure>
                  </div>

                  <div style={{ width: '48rem' }}>
                    <p className='title'>Facebook</p>

                    <p className={`subtitle mt-5 ${profile && profile.facebook ? '' : 'is-hidden'}`} id='facebook'>
                      <a href={`${profile && profile.facebook}`}>{profile && profile.facebook}</a>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className='card-content is-hidden' id='smurfs-card'>
            Smurfs
          </div>
        </div>
      </div>

      <div className='is-flex is-justify-content-center'>
        <div style={{ margin: '0', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}>
          <button className='button is-loading is-large' id='loading' />
        </div>
      </div>
    </div>
  )
}
