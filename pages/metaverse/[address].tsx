import {useEffect, useState} from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
import { useRouter } from 'next/router';


const Metaverse = () => {
  const router = useRouter();
  const [guildAddress, setGuildAddress] = useState<string | null>(null);
  useEffect(() => {
    if (!guildAddress) {
      let address = router.query.address;
      if (typeof address == 'string') {
        setGuildAddress(address);
      }
    }
  }, [router]);

  //pages\metaverse\Build\clientBuild.loader.js
  //console.log(guildAddress);
  const { unityProvider } = useUnityContext({
    loaderUrl: "../unity/Build/clientBuild.loader.js",
    dataUrl: "../unity/Build/clientBuild.data",
    frameworkUrl: "../unity/Build/clientBuild.framework.js",
    codeUrl: "../unity/Build/clientBuild.wasm",
  });

  return <div style={{ width: '100%',display: 'flex', justifyContent: 'center', alignContent: 'center'}}><Unity style={{ minWidth: "92vw", minHeight: "92vh"}} unityProvider={unityProvider} /> </div>;
};

export default Metaverse;
