import { ReactNode } from 'react'
import { useSigningClient } from 'contexts/client'
import Loader from './Loader'

function WalletLoader({
  children,
  loading = false,
}: {
  children: ReactNode
  loading?: boolean
}) {
  const {
    walletAddress,
    loading: clientLoading,
    error,
    connectWallet,
  } = useSigningClient()

  if (loading || clientLoading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  if (walletAddress === '') {
    return (
      <div>
        <h1>
          Welcome to <a>Coreum!</a>
        </h1>

        <p>
          Get started by installing{' '}
          <a href="https://keplr.app/">Keplr wallet</a>
        </p>

        <div>
          <button onClick={connectWallet}>
            <h3>Connect your wallet &rarr;</h3>
            <p>Get your Keplr wallet connected now and start using it.</p>
          </button>
        </div>
      </div>
    )
  }

  if (error) {
    return <code>{JSON.stringify(error)}</code>
  }

  return <>{children}</>
}

export default WalletLoader
