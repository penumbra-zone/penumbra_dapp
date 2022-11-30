import { useEffect, useState } from 'react';
import { Assets } from './Assets';
import { ChainParameters } from './ChainParameters';
import { Tabs } from './components/Tab';
import { Descriptions } from './Descriptions';
import img from './assets/img/logo.png';
import { Status } from './Status';

declare global {
  interface Window {
    penumbra: any;
  }
}

function App() {
  const [isPenumbra, setIsPenumbra] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const interval = setTimeout(() => {
      setIsPenumbra(Boolean(window.penumbra));
      setIsLoading(false);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) return <></>;

  return (
    <div className="flex item-center justify-center mx-[104px]">
      {!isPenumbra ? (
        <p className="h1 mt-[300px]">Install Penumbra</p>
      ) : (
        <div className="w-[100%] flex flex-col">
          <div>
            <img
              src={img}
              alt="penumbra log"
              className="w-[192px] object-cover cursor-pointer"
            />
          </div>
          <div className="p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]">
            <Tabs
              tabs={['Description', 'Request']}
              children={(type: string) =>
                type === 'Description' ? (
                  <Descriptions
                    desc="Get current status of chain sync"
                    type="Status"
                    requestFields={[
                      {
                        type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
                        desc: '// Identifies the FVK for the notes to query.',
                      },
                    ]}
                    responseFields={[
                      {
                        type: 'uint64 sync_height = 1;',
                        desc: '// The height the view service has synchronized to so far',
                      },
                      {
                        type: 'bool catching_up = 2;',
                        desc: '// Whether the view service is catching up with the chain state',
                      },
                    ]}
                  />
                ) : (
                  <Status />
                )
              }
            />
          </div>
          <div className="p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]">
            <Tabs
              tabs={['Description', 'Request']}
              children={(type: string) =>
                type === 'Description' ? (
                  <Descriptions
                    desc="Queries for assets."
                    type="Assets"
                    requestFields={[
                      {
                        type: '',
                        desc: '//  This message has no fields.',
                      },
                    ]}
                    responseFields={[
                      {
                        type: 'penumbra.core.crypto.v1alpha1.Asset asset = 1;',
                        desc: '',
                      },
                    ]}
                  />
                ) : (
                  <Assets />
                )
              }
            />
          </div>
          <div className="p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]">
            <Tabs
              tabs={['Description', 'Request']}
              children={(type: string) =>
                type === 'Description' ? (
                  <Descriptions
                    desc="Query for the current chain parameters."
                    type="ChainParameters"
                    requestFields={[
                      {
                        type: '',
                        desc: '//  This message has no fields.',
                      },
                    ]}
                    responseFields={[
                      {
                        type: 'penumbra.core.chain.v1alpha1.ChainParameters parameters = 1;',
                        desc: '',
                      },
                    ]}
                  />
                ) : (
                  <ChainParameters />
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
