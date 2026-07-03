/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[450px] flex flex-col items-center justify-center text-center p-8 bg-white border border-[#D8D8D8] rounded-2xl max-w-lg mx-auto my-12 shadow-sm">
          <div className="p-4 rounded-full bg-rose-50 text-rose-600 mb-5 border border-rose-100">
            <AlertOctagon size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#2F2F2F] font-display tracking-tight mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[#666666] mb-6 max-w-sm leading-relaxed">
            The Sales OS encountered an unexpected interface crash. We have logged the error details.
          </p>
          {this.state.error && (
            <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 mb-6 text-left overflow-x-auto max-h-40">
              <code className="text-xs font-mono text-rose-700 block whitespace-pre-wrap">
                {this.state.error.toString()}
              </code>
            </div>
          )}
          <Button
            variant="primary"
            onClick={this.handleReset}
            icon={<RefreshCw size={16} />}
          >
            Reload Interface
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
