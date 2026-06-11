/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Terminal, ShieldCheck, Database, HardDrive, Mail, Cloud, Cpu, Sparkles, RefreshCw, Layers 
} from "lucide-react";

interface AwsConsoleProps {
  onRefreshTrigger: number;
}

export default function AwsConsoleView({ onRefreshTrigger }: AwsConsoleProps) {
  const [awsData, setAwsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"cognito" | "s3" | "dynamodb" | "ses">("cognito");

  const fetchAwsConsoleData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/aws/console");
      if (response.ok) {
        const data = await response.json();
        setAwsData(data);
      }
    } catch (err) {
      console.error("Failed to query AWS console simulation API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwsConsoleData();
  }, [onRefreshTrigger, activeConsoleTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="aws-console-view">
      
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Cloud className="h-6 w-6 text-sky-500" />
            AWS Resource Console (Sandbox Simulator)
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Real-time telemetry showing live AWS Cloud states representing S3 uploads, SES notifications, Cognito User Pools, and DynamoDB document tables.
          </p>
        </div>

        <button
          onClick={fetchAwsConsoleData}
          className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Sync Cloud Resources
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 space-y-2">
          <Cpu className="h-8 w-8 text-sky-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Querying Cloud resource configurations...</p>
        </div>
      ) : awsData ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="aws-view-row">
          
          {/* AWS Service Selection Sidebar Menu Column */}
          <div className="space-y-2">
            {[
              { id: "cognito", label: "AWS Cognito", desc: "User Pools / Auth Gateway", count: awsData.cognitoUsers?.length, icon: ShieldCheck, color: "text-amber-500" },
              { id: "s3", label: "AWS S3 Bucket", desc: "Structured product assets", count: awsData.s3Storage?.length, icon: HardDrive, color: "text-emerald-500" },
              { id: "dynamodb", label: "AWS DynamoDB", desc: "Orders document schema", count: awsData.dynamoReceipts?.length, icon: Database, color: "text-indigo-500" },
              { id: "ses", label: "AWS SES Hub", desc: "Sent E-mails logs tracker", count: awsData.sesEmails?.length, icon: Mail, color: "text-blue-500" }
            ].map(svc => {
              const SvcIcon = svc.icon;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveConsoleTab(svc.id as any)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer relative ${
                    activeConsoleTab === svc.id
                      ? "bg-sky-50/50 border-sky-400 font-extrabold shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className={`p-2.5 rounded-xl bg-white border border-gray-100 shadow-xs shrink-0 ${svc.color}`}>
                    <SvcIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-gray-900 text-sm block">{svc.label}</span>
                    <span className="text-[10px] text-gray-400 font-semibold block">{svc.desc}</span>
                  </div>
                  {svc.count !== undefined && (
                    <span className="bg-sky-100 text-sky-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                      {svc.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-5 text-xs space-y-3 shadow-md">
              <div className="flex items-center gap-1 text-sky-400 font-bold uppercase tracking-wider">
                <Layers className="h-4 w-4" /> Architecture Code
              </div>
              <p className="text-slate-350 leading-relaxed text-[11px]">
                We utilize **AWS Amplify** to host this client React workspace. Requests are proxied into a serverless **AWS Lambda** script that directly updates **DynamoDB** and dispatches triggers via **SES Notifications**.
              </p>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800 pt-2">
                <span>STAGE: SANDBOX</span>
                <span>VER: v1.0.2</span>
              </div>
            </div>
          </div>

          {/* AWS Details Container Content Area */}
          <div className="lg:col-span-3 bg-white border rounded-3xl shadow-sm min-h-[500px] flex flex-col justify-between" id="aws-service-console">
            
            {/* Cognito User pool inspector */}
            {activeConsoleTab === "cognito" && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">AWS Cognito User Pools Inspector</h3>
                  <p className="text-gray-400 text-xs">Table: pool_identity_azbuynow_users</p>
                </div>

                <div className="divide-y border rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 flex py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase font-mono">
                    <span className="w-1/4">User ARN/ID</span>
                    <span className="w-1/4">Display Name</span>
                    <span className="w-1/4">Email (Verified)</span>
                    <span className="w-1/4 text-right">Cognito Role</span>
                  </div>
                  {awsData.cognitoUsers?.map((user: any) => (
                    <div key={user.id} className="flex py-3.5 px-4 text-xs font-medium text-gray-600 hover:bg-slate-50 items-center">
                      <span className="w-1/4 font-mono text-[10px] text-gray-400 truncate">{user.id}</span>
                      <span className="w-1/4 font-bold text-gray-800">{user.name}</span>
                      <span className="w-1/4 font-mono text-gray-500 truncate">{user.email}</span>
                      <span className="w-1/4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          user.role === 'Admin' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {user.role}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* S3 Storage explorer */}
            {activeConsoleTab === "s3" && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">AWS S3 Assets Hub</h3>
                  <p className="text-gray-400 text-xs">Bucket ARN: arn:aws:s3:::azbuynow-assets/products/</p>
                </div>

                <div className="divide-y border rounded-2xl overflow-hidden">
                  <div className="bg-gray-50 flex py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase font-mono">
                    <span className="flex-1">S3 Key Path</span>
                    <span className="w-1/4">Linked Item SKU</span>
                    <span className="w-1/6 text-right">Size (KB)</span>
                  </div>
                  {awsData.s3Storage?.slice(0, 10).map((file: any, i: number) => (
                    <div key={i} className="flex py-3.5 px-4 text-xs font-medium text-gray-600 hover:bg-slate-50 items-center">
                      <span className="flex-1 font-mono text-[11px] text-emerald-600 truncate">{file.key}</span>
                      <span className="w-1/4 font-bold text-gray-800 truncate">{file.productName}</span>
                      <span className="w-1/6 text-right font-mono text-gray-500">{file.sizeKb} KB</span>
                    </div>
                  ))}
                  {awsData.s3Storage?.length > 10 && (
                    <div className="p-3 text-center text-[11px] text-gray-400 bg-gray-50 font-semibold uppercase">
                      + {awsData.s3Storage.length - 10} additional S3 keys logged inside asset bucket
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DynamoDB records panel */}
            {activeConsoleTab === "dynamodb" && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">AWS DynamoDB Document Schemas</h3>
                  <p className="text-gray-400 text-xs">Table: default_orders_nosql_ledger</p>
                </div>

                {awsData.dynamoReceipts?.length > 0 ? (
                  <div className="space-y-4">
                    {awsData.dynamoReceipts.slice(0, 3).map((ord: any) => (
                      <div key={ord.orderId} className="border rounded-2xl p-4 bg-slate-50 relative">
                        <div className="flex justify-between items-center pb-2 border-b mb-3 text-xs">
                          <span className="font-mono font-extrabold text-gray-800">PartitionKey: {ord.orderId}</span>
                          <span className="text-[10px] text-gray-400 font-mono">SortKey: {ord.createdAt}</span>
                        </div>
                        <pre className="text-[10px] font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap leading-tight bg-white p-3 rounded-lg border">
                          {JSON.stringify(ord, null, 2)}
                        </pre>
                      </div>
                    ))}
                    {awsData.dynamoReceipts.length > 3 && (
                      <div className="text-center text-xs text-gray-400 py-2">
                        + {awsData.dynamoReceipts.length - 3} older partition keys verified in DynamoDB
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed rounded-2xl text-center text-gray-400 text-sm">
                    No order documents found in DynamoDB table yet. Check out from Products tab!
                  </div>
                )}
              </div>
            )}

            {/* SES Email triggers logger */}
            {activeConsoleTab === "ses" && (
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">AWS SES Sent Mail Logs</h3>
                  <p className="text-gray-400 text-xs">Service: Simple Email Service (V2 Console API)</p>
                </div>

                <div className="space-y-4">
                  {awsData.sesEmails?.map((mail: any) => (
                    <div key={mail.id} className="border rounded-2xl bg-slate-50 overflow-hidden text-xs">
                      <div className="bg-slate-100 p-3.5 border-b flex flex-col sm:flex-row justify-between gap-1">
                        <div>
                          <span className="font-bold text-gray-950 block">{mail.subject}</span>
                          <span className="text-[10px] text-gray-400 block font-mono">RECIPIENT: {mail.recipient}</span>
                        </div>
                        <div className="text-right flex flex-col items-start sm:items-end">
                          <span className={`inline-block px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                            mail.type === 'AdminNotification' ? 'bg-indigo-50 text-indigo-700 border' : 'bg-amber-50 text-amber-700 border'
                          }`}>
                            {mail.type === 'AdminNotification' ? 'Admin Trigger' : 'Customer Confirmation'}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 block mt-0.5">{mail.sentAt}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <pre className="font-mono text-slate-700 text-[10px] whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border leading-tight">
                          {mail.body}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Console Footer bar details */}
            <div className="bg-slate-50 px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 font-medium">
              <span>Secure telemetry authenticated by AWS IAM Role: <strong>AzbuynowGatewayExecutive</strong></span>
              <span className="text-[10.5px] font-mono mt-1 sm:mt-0">Node.JS Lambda Service Live</span>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-20 text-red-500">
          Failed to query cloud configurations from Express service. Make sure the server is healthy.
        </div>
      )}

    </div>
  );
}
