import { useSigningClient } from 'contexts/client'
import Link from 'next/link'
import Image from 'next/image'
import Router from 'next/router'

function Nav() {
  const { walletAddress, connectWallet, disconnect } = useSigningClient()
  const handleConnect = () => {
    if (walletAddress.length === 0) {
      connectWallet()
    } else {
      disconnect()
      Router.push('/')
    }
  }

  const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || ''

  return (
    <div>
      <nav>
        <div>
          <Link href="/">
            <a>
              {PUBLIC_SITE_ICON_URL.length > 0 ? (
                <Image
                  src={PUBLIC_SITE_ICON_URL}
                  height={32}
                  width={32}
                  alt="Logo"
                />
              ) : (
                <span>⚛️ </span>
              )}
            </a>
          </Link>
          <Link href="/">
            <a>{process.env.NEXT_PUBLIC_SITE_TITLE}</a>
          </Link>
        </div>
        <div>
          <button onClick={handleConnect}>
            {walletAddress || 'Connect Wallet'}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav
