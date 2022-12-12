import { useEffect, useState } from 'react';
import { Assets } from './Assets';
import { ChainParameters } from './ChainParameters';
import { Tabs } from './components/Tab';
import { Descriptions } from './Descriptions';
import img from './assets/img/logo.png';
import { Status } from './Status';
import { Notes } from './Notes';
import { TransactionHashes } from './TransactionHashes';
import { Transactions } from './Transactions';
import { TransactionByHash } from './TransactionByHash';
import { NoteByCommitment } from './NoteByCommitment';
import {
  isPenumbraInstalled,
  ProviderPenumbra,
} from './utils/ProviderPenumbra';
import { Button } from './components/Tab/Button';
import { UserData } from './Signer/types';

export const getShortKey = (text: string) => {
  if (!text) return '';
  return text.slice(0, 10) + '..' + text.slice(-9);
};

function App() {
  const [isPenumbra, setIsPenumbra] = useState<boolean>(false);
  const [userData, setUserData] = useState<null | UserData>(null);

  const penumbra = new ProviderPenumbra();

  const checkIsPenumbraInstalled = async () => {
    const isInstalled = await isPenumbraInstalled();
    setIsPenumbra(isInstalled);
  };

  useEffect(() => {
    checkIsPenumbraInstalled();
  }, []);

  const handleConnect = async () => {
    const data = await penumbra.login();
    setUserData(data);
  };

  return (
    <div className="flex item-center justify-center mx-[104px]">
      {!isPenumbra ? (
        <p className="h1 mt-[300px]">Install Penumbra</p>
      ) : (
        <div className="w-[100%] flex flex-col">
          <div className="w-[100%] flex justify-between items-center">
            <img
              src={img}
              alt="penumbra log"
              className="w-[192px] object-cover cursor-pointer"
            />
            {userData ? (
              <p className="h3">{getShortKey(userData.addressByIndex)}</p>
            ) : (
              <Button
                mode="gradient"
                title="Connect"
                className="w-[200px]"
                onClick={handleConnect}
              />
            )}
          </div>
          {userData ? (
            <>
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
                        desc="Queries for notes that have been accepted by the core.chain.v1alpha1."
                        type="Notes"
                        requestFields={[
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
                            desc: '// Identifies the FVK for the notes to query.',
                          },
                          {
                            type: 'bool include_spent = 2;',
                            desc: '// If set, return spent notes as well as unspent notes.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AssetId asset_id = 3;',
                            desc: '// If set, only return notes with the specified asset id.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 4;',
                            desc: '// If set, only return notes with the specified address incore.dex.v1alpha1.',
                          },
                          {
                            type: 'uint64 amount_to_spend = 5;',
                            desc: '// If set, stop returning notes once the total exceeds this amount. gnored if `asset_id` is unset or if `include_spent` is set.',
                          },
                        ]}
                        responseFields={[
                          {
                            type: '	penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 1;',
                            desc: '// The note commitment, identifying the note.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.Note note = 2;',
                            desc: '// The note plaintext itself.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 3;',
                            desc: "// A precomputed decryption of the note's address incore.dex.v1alpha1.",
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.Nullifier nullifier = 4;',
                            desc: "// The note's nullifier.",
                          },
                          {
                            type: 'uint64 height_created = 5;',
                            desc: '// The height at which the note was created.',
                          },
                          {
                            type: 'optional uint64 height_spent = 6;',
                            desc: '// Records whether the note was spent (and if so, at what height).',
                          },
                          {
                            type: 'uint64 position = 7;',
                            desc: '// The note position.',
                          },
                          {
                            type: 'penumbra.core.chain.v1alpha1.NoteSource source = 8;',
                            desc: '// The source of the note (a tx hash or otherwise)',
                          },
                        ]}
                      />
                    ) : (
                      <Notes />
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
                        desc="Query for a note by its note commitment, optionally waiting until the note is detected."
                        type="NoteByCommitment"
                        requestFields={[
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AccountID account_id = 1;',
                            desc: '// Identifies the FVK for the notes to query.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 2;',
                            desc: '',
                          },
                          {
                            type: 'bool await_detection = 3;',
                            desc: '// If set to true, waits to return until the requested note is detected.',
                          },
                        ]}
                        responseFields={[
                          {
                            type: '	penumbra.core.crypto.v1alpha1.NoteCommitment note_commitment = 1;',
                            desc: '// The note commitment, identifying the note.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.Note note = 2;',
                            desc: '// The note plaintext itself.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.AddressIndex address_index = 3;',
                            desc: "// A precomputed decryption of the note's address incore.dex.v1alpha1.",
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.Nullifier nullifier = 4;',
                            desc: "// The note's nullifier.",
                          },
                          {
                            type: 'uint64 height_created = 5;',
                            desc: '// The height at which the note was created.',
                          },
                          {
                            type: 'optional uint64 height_spent = 6;',
                            desc: '// Records whether the note was spent (and if so, at what height).',
                          },
                          {
                            type: 'uint64 position = 7;',
                            desc: '// The note position.',
                          },
                          {
                            type: 'penumbra.core.chain.v1alpha1.NoteSource source = 8;',
                            desc: '// The source of the note (a tx hash or otherwise)',
                          },
                        ]}
                      />
                    ) : (
                      <NoteByCommitment />
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
              <div className="p-[12px] border-[1px] border-solid border-dark_grey rounded-[15px] mt-[10px]">
                <Tabs
                  tabs={['Description', 'Request']}
                  children={(type: string) =>
                    type === 'Description' ? (
                      <Descriptions
                        desc="Query for the transaction hashes in the given range of blocks."
                        type="TransactionHashes"
                        requestFields={[
                          {
                            type: 'optional uint64 start_height = 1;',
                            desc: '// If present, return only transactions after this height.',
                          },
                          {
                            type: 'optional uint64 end_height = 2;',
                            desc: '// If present, return only transactions before this height.',
                          },
                        ]}
                        responseFields={[
                          {
                            type: 'uint64 block_height = 1;',
                            desc: '',
                          },
                          {
                            type: 'bytes tx_hash = 2;',
                            desc: '',
                          },
                        ]}
                      />
                    ) : (
                      <TransactionHashes />
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
                        desc="Query for the full transactions in the given range of blocks."
                        type="Transactions"
                        requestFields={[
                          {
                            type: 'optional uint64 start_height = 1;',
                            desc: '// If present, return only transactions after this height.',
                          },
                          {
                            type: 'optional uint64 end_height = 2;',
                            desc: '// If present, return only transactions before this height.',
                          },
                        ]}
                        responseFields={[
                          {
                            type: 'uint64 block_height = 1;',
                            desc: '',
                          },
                          {
                            type: 'bytes tx_hash = 2;',
                            desc: '',
                          },
                          {
                            type: 'penumbra.core.transaction.v1alpha1.Transaction tx = 3;',
                            desc: '',
                          },
                        ]}
                      />
                    ) : (
                      <Transactions />
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
                        desc="Query for a given transaction hash."
                        type="TransactionByHash"
                        requestFields={[
                          {
                            type: 'bytes tx_hash = 1;',
                            desc: '// The transaction hash to query for.',
                          },
                        ]}
                        responseFields={[
                          {
                            type: 'TransactionBody body = 1;',
                            desc: '',
                          },
                          {
                            type: 'bytes binding_sig = 2;',
                            desc: '// The binding signature is stored separately from the transaction body that it signs.',
                          },
                          {
                            type: 'penumbra.core.crypto.v1alpha1.MerkleRoot anchor = 3;',
                            desc: '// The root of some previous state of the note commitment tree, used as an anchor for all ZK state transition proofs.',
                          },
                        ]}
                      />
                    ) : (
                      <TransactionByHash />
                    )
                  }
                />
              </div>
            </>
          ) : (
            <p className="h1 mt-[300px] text-center">Connect to Penumbra if you want to have access to request</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
