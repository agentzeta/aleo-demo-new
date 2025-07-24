import React, { useState, useEffect } from 'react';
import './fml-nav-calculator.css';
import { AlertCircle, Lock, Unlock, Eye, EyeOff, Calculator, Shield, FileText, CheckCircle, RefreshCw } from 'lucide-react';



export default function PrivateNavCalculator() {

  const [fundData, setFundData] = useState({

    name: 'Aleo Privacy Fund I',

    totalShares: 1000000,

    positions: [

      { asset: 'BTC', quantity: 50, currentPrice: 95000, allocation: 0 },

      { asset: 'ETH', quantity: 500, currentPrice: 3800, allocation: 0 },

      { asset: 'ALEO', quantity: 100000, currentPrice: 2.5, allocation: 0 },

      { asset: 'SOL', quantity: 2000, currentPrice: 180, allocation: 0 },

      { asset: 'USDC', quantity: 500000, currentPrice: 1, allocation: 0 }

    ]

  });



  const [privateMode, setPrivateMode] = useState(true);

  const [showPositions, setShowPositions] = useState(false);

  const [calculating, setCalculating] = useState(false);

  const [proofGenerated, setProofGenerated] = useState(false);

  const [zkProof, setZkProof] = useState('');

  const [totalNAV, setTotalNAV] = useState(0);

  const [navPerShare, setNavPerShare] = useState(0);



  // Calculate NAV and allocations

  useEffect(() => {

    const nav = fundData.positions.reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0);

    const updatedPositions = fundData.positions.map(pos => ({

      ...pos,

      allocation: ((pos.quantity * pos.currentPrice) / nav) * 100

    }));

    

    setFundData(prev => ({ ...prev, positions: updatedPositions }));

    setTotalNAV(nav);

    setNavPerShare(nav / fundData.totalShares);

  }, [fundData.positions, fundData.totalShares]);



  const generateZKProof = async () => {

    setCalculating(true);

    setProofGenerated(false);

    

    // Simulate ZK proof generation

    await new Promise(resolve => setTimeout(resolve, 2000));

    

    // Generate mock ZK proof

    const proof = {

      commitment: `0x${Math.random().toString(16).substr(2, 64)}`,

      nullifier: `0x${Math.random().toString(16).substr(2, 64)}`,

      publicInputs: {

        totalNAV: totalNAV.toFixed(2),

        timestamp: new Date().toISOString(),

        fundId: `0x${Math.random().toString(16).substr(2, 16)}`

      },

      proof: `zk_proof_${Math.random().toString(36).substr(2, 9)}`

    };

    

    setZkProof(JSON.stringify(proof, null, 2));

    setProofGenerated(true);

    setCalculating(false);

  };



  const updatePrice = (index, newPrice) => {

    const updatedPositions = [...fundData.positions];

    updatedPositions[index].currentPrice = parseFloat(newPrice) || 0;

    setFundData({ ...fundData, positions: updatedPositions });

  };



  const addPosition = () => {

    const newPosition = {

      asset: 'NEW',

      quantity: 0,

      currentPrice: 0,

      allocation: 0

    };

    setFundData({ ...fundData, positions: [...fundData.positions, newPosition] });

  };



  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-3xl font-bold text-white mb-2">FML Protocol: Private NAV Calculator</h1>

              <p className="text-blue-200">Zero-Knowledge Fund Valuation on Aleo</p>

            </div>

            <div className="flex items-center gap-4">

              <button

                onClick={() => setPrivateMode(!privateMode)}

                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${

                  privateMode 

                    ? 'bg-green-500/20 text-green-300 border border-green-400' 

                    : 'bg-red-500/20 text-red-300 border border-red-400'

                }`}

              >

                {privateMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}

                {privateMode ? 'Private Mode' : 'Public Mode'}

              </button>

            </div>

          </div>

        </div>



        {/* Main Content Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column - Fund Positions */}

          <div className="space-y-6">

            {/* Fund Info */}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">

              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">

                <Shield className="w-5 h-5 text-blue-400" />

                Fund Information

              </h2>

              <div className="space-y-3">

                <div className="flex justify-between text-gray-200">

                  <span>Fund Name:</span>

                  <span className="font-mono">{fundData.name}</span>

                </div>

                <div className="flex justify-between text-gray-200">

                  <span>Total Shares:</span>

                  <span className="font-mono">{fundData.totalShares.toLocaleString()}</span>

                </div>

                <div className="flex justify-between text-gray-200">

                  <span>Privacy Status:</span>

                  <span className={`font-mono ${privateMode ? 'text-green-400' : 'text-red-400'}`}>

                    {privateMode ? 'Protected' : 'Public'}

                  </span>

                </div>

              </div>

            </div>



            {/* Positions */}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-semibold text-white flex items-center gap-2">

                  <FileText className="w-5 h-5 text-blue-400" />

                  Portfolio Positions

                </h2>

                <button

                  onClick={() => setShowPositions(!showPositions)}

                  className="flex items-center gap-2 text-sm text-blue-300 hover:text-blue-200"

                >

                  {showPositions ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}

                  {showPositions ? 'Hide' : 'Show'}

                </button>

              </div>



              {!privateMode || showPositions ? (

                <div className="space-y-3">

                  <div className="grid grid-cols-4 text-sm text-gray-400 pb-2 border-b border-gray-700">

                    <div>Asset</div>

                    <div className="text-right">Quantity</div>

                    <div className="text-right">Price</div>

                    <div className="text-right">Allocation</div>

                  </div>

                  {fundData.positions.map((position, index) => (

                    <div key={index} className="grid grid-cols-4 text-gray-200 py-2 border-b border-gray-800">

                      <div className="font-mono">{position.asset}</div>

                      <div className="text-right font-mono">{position.quantity.toLocaleString()}</div>

                      <div className="text-right">

                        <input

                          type="number"

                          value={position.currentPrice}

                          onChange={(e) => updatePrice(index, e.target.value)}

                          className="w-20 bg-white/10 border border-gray-600 rounded px-2 py-1 text-right"

                        />

                      </div>

                      <div className="text-right font-mono">{position.allocation.toFixed(2)}%</div>

                    </div>

                  ))}

                  <button

                    onClick={addPosition}

                    className="mt-2 text-sm text-blue-300 hover:text-blue-200"

                  >

                    + Add Position

                  </button>

                </div>

              ) : (

                <div className="text-center py-12 text-gray-400">

                  <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />

                  <p>Portfolio positions are encrypted</p>

                  <p className="text-sm mt-2">Zero-knowledge proof preserves privacy</p>

                </div>

              )}

            </div>

          </div>



          {/* Right Column - NAV Calculation & Proof */}

          <div className="space-y-6">

            {/* NAV Display */}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">

              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">

                <Calculator className="w-5 h-5 text-blue-400" />

                Net Asset Value

              </h2>

              <div className="space-y-4">

                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">

                  <div className="text-sm text-gray-200 mb-1">Total NAV</div>

                  <div className="text-3xl font-bold text-white">

                    ${totalNAV.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                  </div>

                </div>

                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4">

                  <div className="text-sm text-gray-200 mb-1">NAV per Share</div>

                  <div className="text-2xl font-bold text-white">

                    ${navPerShare.toFixed(4)}

                  </div>

                </div>

              </div>

            </div>



            {/* ZK Proof Generation */}

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">

              <h2 className="text-xl font-semibold text-white mb-4">Zero-Knowledge Proof</h2>

              

              <button

                onClick={generateZKProof}

                disabled={calculating}

                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"

              >

                {calculating ? (

                  <>

                    <RefreshCw className="w-5 h-5 animate-spin" />

                    Generating ZK Proof...

                  </>

                ) : (

                  <>

                    <Shield className="w-5 h-5" />

                    Generate NAV Proof

                  </>

                )}

              </button>



              {proofGenerated && (

                <div className="mt-4">

                  <div className="flex items-center gap-2 text-green-400 mb-3">

                    <CheckCircle className="w-5 h-5" />

                    <span className="font-semibold">Proof Generated Successfully</span>

                  </div>

                  <div className="bg-black/30 rounded-lg p-3 overflow-x-auto">

                    <pre className="text-xs text-green-300 font-mono whitespace-pre">

                      {zkProof}

                    </pre>

                  </div>

                </div>

              )}

            </div>



            {/* Info Box */}

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">

              <div className="flex gap-3">

                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />

                <div className="text-sm text-blue-200">

                  <p className="font-semibold mb-1">How it works:</p>

                  <ul className="space-y-1 text-xs">

                    <li>• Portfolio positions remain encrypted on Aleo</li>

                    <li>• Zero-knowledge circuits calculate NAV privately</li>

                    <li>• Only the final NAV and proof are public</li>

                    <li>• Auditors can verify without seeing positions</li>

                  </ul>

                </div>

              </div>

            </div>

          </div>

        </div>



        {/* Footer */}

        <div className="mt-8 text-center text-gray-400 text-sm">

          <p>Built on Aleo | Powered by Zero-Knowledge Proofs</p>

          <p className="mt-1">FML Protocol - Institutional Privacy for DeFi</p>

        </div>

      </div>

    </div>

  );

}