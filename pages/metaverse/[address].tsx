import {useEffect, useState, useCallback, useLayoutEffect} from 'react'
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


  // Comunication to Unity
  const [isReady,setIsReady] = useState(false);
  //const [members, setMembers] = useState<Member[]>([]);

  const { unityProvider, addEventListener, removeEventListener, sendMessage } = useUnityContext({
    loaderUrl: "../unity/Build/clientBuild.loader.js",
    dataUrl: "../unity/Build/clientBuild.data",
    frameworkUrl: "../unity/Build/clientBuild.framework.js",
    codeUrl: "../unity/Build/clientBuild.wasm",
  });

  const handleReady = useCallback((_ready) => {
    setIsReady(!!_ready);
    console.log("true ready is on react: " + _ready);
  }, []);

  useEffect(() => {
    addEventListener("Ready", handleReady);
    return () => {
      removeEventListener("Ready", handleReady);
    };
  }, [addEventListener, removeEventListener, handleReady]);

  useLayoutEffect(() => {
    if (isReady) {
      sendGuildName("jaja");
      sendNFTnum(10);
    }
  }, [isReady]);

  function sendGuildName(name){
    sendMessage("CanvasHUD", "setName", name);
  }

  function sendNFTnum(num){
    console.log("numero:" + num)
    sendMessage("CanvasHUD", "setNFTNumber", num);
  }


  return <div style={{ width: '100%',display: 'flex', justifyContent: 'center', alignContent: 'center'}}><Unity style={{minWidth: "92vw", minHeight: "92vh"}} unityProvider={unityProvider} /> </div>;
};

export default Metaverse;
