<template>
  <div class="admin-page page-layout">
    <div class="page-content">
      <div class="container">
        <!-- Header -->
        <div class="page-header animate-fade-in">
          <div class="header-content">
            <h1 class="section-title">Election Administration</h1>
            <p class="section-subtitle">Create and manage secure, decentralized elections with complete transparency</p>
          </div>
          <div class="wallet-section">
            <button 
              v-if="!isWalletConnected" 
              @click="connectWallet" 
              class="btn btn-primary btn-hover-lift"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="loading-spinner loading-spinner-sm"></span>
              {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
            </button>
            <div v-else class="wallet-info">
              <div class="wallet-address">{{ truncatedAddress }}</div>
              <button @click="disconnectWallet" class="btn btn-outline btn-sm">
                Disconnect
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div v-if="!isWalletConnected" class="wallet-prompt animate-scale">
          <div class="glass-container prompt-card">
            <div class="prompt-content">
              <svg class="prompt-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h2 class="prompt-title">Connect Your Wallet</h2>
              <p class="prompt-description">To create and manage elections, please connect your Aptos wallet to get started</p>
              <button @click="connectWallet" class="btn btn-primary btn-lg btn-hover-lift">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>

        <!-- Admin Dashboard -->
        <div v-else class="admin-dashboard">
          <!-- Simple Election Creation Form -->
          <div class="create-election-section animate-slide-up">
            <div class="glass-container form-container">
              <div class="form-header">
                <h2 class="form-title">Create New Multi-Position Election</h2>
                <p class="form-subtitle">Set up a comprehensive election with multiple positions and candidates</p>
              </div>
              
              <!-- Relayer Wallet Information -->
              <div class="form-section">
                <ElectionRelayerWallet />
              </div>
              
              <!-- Basic Election Info -->
              <div class="form-section">
                <h3 class="section-header">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Election Details
                </h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Election Title</label>
                    <input 
                      v-model="electionForm.title" 
                      type="text" 
                      placeholder="e.g., Student Union Elections 2025"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Organization</label>
                    <input 
                      v-model="electionForm.organization" 
                      type="text" 
                      placeholder="e.g., University of California"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group form-group-full">
                    <label class="form-label">Description</label>
                    <textarea 
                      v-model="electionForm.description" 
                      placeholder="Brief description of the election and its purpose"
                      class="form-textarea"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Voting Deadline</label>
                    <input 
                      v-model="electionForm.deadline" 
                      type="datetime-local" 
                      class="form-input"
                    />
                    <div v-if="electionForm.deadline" style="margin-top:0.25rem;font-size:0.9em;">
                      <strong>UTC Deadline:</strong> {{ utcDeadlinePreview }}
                    </div>
                    <div v-if="deadlineWarning" style="color:#ffd43b;margin-top:0.25rem;font-size:0.95em;">
                      {{ deadlineWarning }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Positions Section -->
              <div class="form-section">
                <div class="section-header-row">
                  <h3 class="section-header">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Election Positions
                  </h3>
                  <button 
                    @click="addPosition" 
                    type="button" 
                    class="btn btn-outline btn-sm btn-hover-lift"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Add Position
                  </button>
                </div>

                <div class="positions-list">
                  <div 
                    v-for="(position, posIndex) in electionForm.positions" 
                    :key="posIndex" 
                    class="position-card glass-container"
                  >
                    <div class="position-header">
                      <div class="position-title-section">
                        <h4 class="position-title">Position {{ posIndex + 1 }}</h4>
                        <span v-if="position.title" class="position-name">{{ position.title }}</span>
                      </div>
                      <button 
                        v-if="electionForm.positions.length > 1"
                        @click="removePosition(posIndex)" 
                        type="button" 
                        class="btn btn-danger btn-xs"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Remove
                      </button>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Position Title</label>
                        <input 
                          v-model="position.title" 
                          type="text" 
                          placeholder="e.g., President, Board Member"
                          class="form-input"
                        />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Maximum Selections</label>
                        <select v-model="position.maxSelections" class="form-select">
                          <option :value="1">1 (Single choice)</option>
                          <option :value="2">2 (Up to 2 choices)</option>
                          <option :value="3">3 (Up to 3 choices)</option>
                          <option :value="4">4 (Up to 4 choices)</option>
                          <option :value="5">5 (Up to 5 choices)</option>
                        </select>
                      </div>
                      <div class="form-group form-group-full">
                        <label class="form-label">Position Description</label>
                        <textarea 
                          v-model="position.description" 
                          placeholder="Role responsibilities and requirements"
                          class="form-textarea"
                          rows="2"
                        ></textarea>
                      </div>
                    </div>

                    <!-- Candidates for this position -->
                    <div class="candidates-section">
                      <div class="candidates-header">
                        <h5 class="candidates-title">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          </svg>
                          Candidates for {{ position.title || 'this position' }}
                        </h5>
                        <button 
                          @click="addCandidate(posIndex)" 
                          type="button" 
                          class="btn btn-outline btn-xs btn-hover-lift"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                          </svg>
                          Add Candidate
                        </button>
                      </div>

                      <div class="candidates-grid">
                        <div 
                          v-for="(candidate, candIndex) in position.candidates" 
                          :key="candIndex" 
                          class="candidate-card"
                        >
                          <div class="candidate-header">
                            <span class="candidate-number">Candidate {{ candIndex + 1 }}</span>
                            <button 
                              v-if="position.candidates.length > 1"
                              @click="removeCandidate(posIndex, candIndex)" 
                              type="button" 
                              class="btn btn-danger btn-xs"
                            >
                              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            </button>
                          </div>

                          <div class="form-grid">
                            <div class="form-group">
                              <label class="form-label">Full Name</label>
                              <input 
                                v-model="candidate.name" 
                                type="text" 
                                placeholder="Candidate's full name"
                                class="form-input"
                              />
                            </div>
                            <div class="form-group">
                              <label class="form-label">Party/Affiliation</label>
                              <input 
                                v-model="candidate.party" 
                                type="text" 
                                placeholder="Political party or affiliation"
                                class="form-input"
                              />
                            </div>
                            <div class="form-group form-group-full">
                              <label class="form-label">Bio/Platform</label>
                              <textarea 
                                v-model="candidate.bio" 
                                placeholder="Brief biography and platform"
                                class="form-textarea"
                                rows="2"
                              ></textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Election Options Section -->
              <div class="form-section">
                <h3 class="section-header">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Election Options
                </h3>
                <div class="election-options">
                  <div class="option-group">
                    <div class="option-item">
                      <label class="checkbox-label">
                        <input 
                          v-model="electionForm.allowAbstain" 
                          type="checkbox"
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                        <div class="option-content">
                          <span class="option-title">Allow voters to abstain</span>
                          <span class="option-description">Voters can choose to skip voting on specific positions</span>
                        </div>
                      </label>
                    </div>
                    
                    <div class="option-item">
                      <label class="checkbox-label">
                        <input 
                          v-model="electionForm.requireAllPositions" 
                          type="checkbox"
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                        <div class="option-content">
                          <span class="option-title">Require votes for all positions</span>
                          <span class="option-description">Voters must vote on every position to submit their ballot</span>
                        </div>
                      </label>
                    </div>
                    
                    <div class="option-item">
                      <label class="checkbox-label">
                        <input 
                          v-model="electionForm.allowMultipleSelections" 
                          type="checkbox"
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                        <div class="option-content">
                          <span class="option-title">Enable ranked choice voting</span>
                          <span class="option-description">Allow multiple candidate selections with ranking preferences</span>
                        </div>
                      </label>
                    </div>
                    
                    <div class="option-item">
                      <label class="checkbox-label">
                        <input 
                          v-model="electionForm.resultsVisible" 
                          type="checkbox"
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                        <div class="option-content">
                          <span class="option-title">Make results visible immediately</span>
                          <span class="option-description">Show election results in real-time as votes are cast</span>
                        </div>
                      </label>
                    </div>
                    
                    <div class="option-item">
                      <label class="checkbox-label">
                        <input 
                          v-model="electionForm.allowRevoting" 
                          type="checkbox"
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                        <div class="option-content">
                          <span class="option-title">Allow vote changes</span>
                          <span class="option-description">Voters can modify their votes before the deadline</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Voter Verification Mode Section -->
              <div class="form-section">
                <h3 class="section-header">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.99 6a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Voter Verification Mode
                </h3>
                <p class="section-description">Choose how voters will be verified before they can cast their ballot</p>
                
                <div class="verification-modes">
                  <div class="verification-option">
                    <label class="radio-label">
                      <input 
                        v-model="electionForm.verificationMode" 
                        type="radio" 
                        value="email"
                        class="radio-input"
                      />
                      <span class="radio-custom"></span>
                      <div class="verification-content">
                        <span class="verification-title">Email Only</span>
                        <span class="verification-description">
                          Voters verify their identity using email addresses and receive a 6-digit OTP code to access the ballot
                        </span>
                      </div>
                    </label>
                  </div>

                  <div class="verification-option">
                    <label class="radio-label">
                      <input 
                        v-model="electionForm.verificationMode" 
                        type="radio" 
                        value="zkme"
                        class="radio-input"
                      />
                      <span class="radio-custom"></span>
                      <div class="verification-content">
                        <span class="verification-title">zkMe Only</span>
                        <span class="verification-description">
                          Voters verify through zkMe Liveness Check - a secure biometric verification system
                        </span>
                        <div class="verification-status">
                          <div class="status-item available">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>Liveness Check - Available</span>
                          </div>
                          <div class="status-item coming-soon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>zkLogin with Google - Coming Soon</span>
                          </div>
                          <div class="status-item coming-soon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>Location Proof - Coming Soon</span>
                          </div>
                          <div class="status-item coming-soon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span>On-chain Verification - Coming Soon</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                    <div class="verification-option">
                      <label class="radio-label">
                        <input 
                          v-model="electionForm.verificationMode" 
                          type="radio" 
                          value="zkme-email"
                          class="radio-input"
                        />
                        <span class="radio-custom"></span>
                        <div class="verification-content">
                          <span class="verification-title">zkMe + Email (Dual Verification)</span>
                          <span class="verification-description">
                            Maximum security: Voters must pass both zkMe Liveness Check AND email OTP verification
                          </span>
                          <div class="verification-benefits">
                            <div class="benefit-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                              </svg>
                              <span>Highest security level</span>
                            </div>
                            <div class="benefit-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                              </svg>
                              <span>Prevents impersonation attacks</span>
                            </div>
                            <div class="benefit-item">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                              </svg>
                              <span>Compliant with enterprise requirements</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Voter Email Upload Section (Conditional) -->
              <div v-if="electionForm.verificationMode === 'email' || electionForm.verificationMode === 'zkme-email'" class="form-section">
                <h3 class="section-header">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Eligible Voters
                </h3>
                <div class="voter-upload-section">
                  <div class="upload-methods">
                    <!-- CSV/JSON File Upload -->
                    <div class="upload-method">
                      <h4 class="upload-method-title">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        Upload Email List
                      </h4>
                      <p class="upload-method-description">Upload a CSV or JSON file containing voter email addresses</p>
                      
                      <input 
                        ref="fileInput"
                        type="file" 
                        accept=".csv,.json,.txt" 
                        @change="handleFileUpload"
                        style="display: none"
                        multiple="false"
                      />
                      
                      <div class="upload-area" @click="$refs.fileInput?.click()" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
                        <div v-if="!voterFile" class="upload-placeholder">
                          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                          </svg>
                          <div class="upload-text">
                            <p class="upload-title">Click to upload or drag and drop</p>
                            <p class="upload-subtitle">CSV, JSON, or TXT files (Max 10MB)</p>
                          </div>
                        </div>
                        
                        <div v-else class="upload-success">
                          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          <div class="file-info">
                            <p class="file-name">{{ voterFile.name }}</p>
                            <p class="file-stats">{{ voterEmails.length }} email addresses loaded</p>
                          </div>
                          <button @click.stop="removeFile" class="remove-file-btn">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="upload-format-info">
                        <h5>Supported Formats:</h5>
                        <ul>
                          <li><strong>CSV:</strong> One email per line or comma-separated</li>
                          <li><strong>JSON:</strong> Array of email strings: ["email1@example.com", "email2@example.com"]</li>
                          <li><strong>TXT:</strong> One email address per line</li>
                        </ul>
                      </div>
                    </div>

                    <!-- Manual Email Entry -->
                    <div class="upload-method">
                      <h4 class="upload-method-title">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Manual Entry
                      </h4>
                      <p class="upload-method-description">Add email addresses manually, one per line. Invalid emails will be automatically filtered out.</p>
                      
                      <div class="manual-email-section">
                        <div class="textarea-container">
                          <textarea 
                            v-model="manualEmails" 
                            placeholder="Enter email addresses, one per line:&#10;user1@example.com&#10;user2@example.com&#10;user3@example.com"
                            class="email-textarea"
                            rows="8"
                            @input="parseManualEmails"
                          ></textarea>
                          <div class="textarea-footer">
                            <span class="char-count">{{ manualEmails.length }} characters</span>
                            <button 
                              v-if="manualEmails.length > 0" 
                              @click="clearManualEmails" 
                              type="button"
                              class="clear-textarea-btn"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        
                        <div v-if="parsedManualEmails.length > 0 || manualEmailErrors.length > 0" class="manual-email-preview">
                          <div v-if="parsedManualEmails.length > 0" class="valid-emails">
                            <p class="preview-count">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              {{ parsedManualEmails.length }} valid email(s)
                            </p>
                            <div class="email-tags">
                              <span v-for="(email, index) in parsedManualEmails.slice(0, 6)" :key="index" class="email-tag valid">
                                {{ email }}
                              </span>
                              <span v-if="parsedManualEmails.length > 6" class="email-tag-more">
                                +{{ parsedManualEmails.length - 6 }} more
                              </span>
                            </div>
                          </div>
                          
                          <div v-if="manualEmailErrors.length > 0" class="invalid-emails">
                            <p class="error-count">
                              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              {{ manualEmailErrors.length }} invalid line(s) ignored
                            </p>
                            <div class="error-tags">
                              <span v-for="(error, index) in manualEmailErrors.slice(0, 3)" :key="index" class="email-tag invalid">
                                {{ error }}
                              </span>
                              <span v-if="manualEmailErrors.length > 3" class="email-tag-more error">
                                +{{ manualEmailErrors.length - 3 }} more errors
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Combined Email Summary -->
                  <div v-if="totalVoterEmails.length > 0" class="voter-summary">
                    <div class="summary-header">
                      <h4>Eligible Voters Summary</h4>
                      <span class="voter-count">{{ totalVoterEmails.length }} total voters</span>
                    </div>
                    
                    <div class="summary-stats">
                      <div class="stat-item">
                        <span class="stat-label">From file:</span>
                        <span class="stat-value">{{ voterEmails.length }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Manual entry:</span>
                        <span class="stat-value">{{ parsedManualEmails.length }}</span>
                      </div>
                      <div class="stat-item">
                        <span class="stat-label">Duplicates removed:</span>
                        <span class="stat-value">{{ (voterEmails.length + parsedManualEmails.length) - totalVoterEmails.length }}</span>
                      </div>
                    </div>
                    
                    <div class="summary-actions">
                      <button @click="downloadVoterList" class="btn btn-outline btn-sm">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-4-4m4 4l4-4m-4-4V4"/>
                        </svg>
                        Download List
                      </button>
                      <button @click="clearAllEmails" class="btn btn-ghost btn-sm">
                        Clear All
                      </button>
                    </div>
                  </div>

                  <!-- Email Required Warning -->
                  <div v-else-if="(electionForm.verificationMode === 'email' || electionForm.verificationMode === 'zkme-email')" class="email-required-warning">
                    <div class="warning-content">
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <div class="warning-text">
                        <h4>Voter Email List Required</h4>
                        <p>You must provide a list of eligible voter email addresses for {{ electionForm.verificationMode === 'email' ? 'Email' : 'zkMe + Email' }} verification mode.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Section -->
              <div class="form-actions">
                <div class="action-buttons">
                  <button 
                    @click="resetForm" 
                    type="button" 
                    class="btn btn-ghost"
                  >
                    Reset Form
                  </button>
                  <button 
                    @click="createElection" 
                    type="button" 
                    class="btn btn-primary btn-lg btn-hover-lift"
                    :disabled="!canSubmit || isSubmitting"
                  >
                    <span v-if="isSubmitting" class="loading-spinner loading-spinner-sm"></span>
                    <svg v-else width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ isSubmitting ? 'Creating Election...' : 'Create Election' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="successMessage" class="message-card success-card animate-fade-in">
            <div class="glass-container">
              <div class="message-content">
                <svg class="message-icon success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="message-text">
                  <h3 class="message-title">Election Created Successfully!</h3>
                  <p class="message-description">{{ successMessage }}</p>
                </div>
                <button @click="successMessage = ''" class="btn btn-outline btn-sm">
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="message-card error-card animate-fade-in">
            <div class="glass-container">
              <div class="message-content">
                <svg class="message-icon error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div class="message-text">
                  <h3 class="message-title">Error Creating Election</h3>
                  <p class="message-description">{{ errorMessage }}</p>
                </div>
                <button @click="errorMessage = ''" class="btn btn-outline btn-sm">
                  Dismiss
                </button>
              </div>
            </div>        </div>
      </div>
    </div>
  </div>
  <div v-if="votingLink" class="voting-link-success">
    <h3>Election Voting Link</h3>
    <p>Share this link with your voters:</p>
    <input type="text" :value="votingLink" readonly style="width:100%;padding:0.5rem;" />
    <a :href="votingLink" target="_blank" class="btn btn-primary" style="margin-top:0.5rem;">Open Voting Page</a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import ElectionRelayerWallet from '../components/ElectionRelayerWallet.vue'

const router = useRouter()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Reactive data
const creatingElection = ref(false)
const voterFile = ref(null)
const voterEmails = ref([])
const manualEmails = ref('')
const parsedManualEmails = ref([])
const manualEmailErrors = ref([])
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const votingLink = ref('');

// Enhanced election form for multi-position elections
const electionForm = ref({
  title: '',
  description: '',
  organization: '',
  deadline: '',
  allowAbstain: true,
  requireAllPositions: false,
  resultsVisible: false,
  allowMultipleSelections: false,
  allowRevoting: false,
  verificationMode: 'email',
  positions: [
    {
      title: '',
      description: '',
      maxSelections: 1,
      candidates: [
        { 
          name: '', 
          description: '', 
          party: '', 
          qualifications: '', 
          imageUrl: '' 
        }
      ]
    }
  ]
})

// Computed properties
const isWalletConnected = computed(() => authStore.isLoggedIn)
const truncatedAddress = computed(() => authStore.truncatedAddress)

const canCreateElection = computed(() => {
  const baseValidation = electionForm.value.title && 
         electionForm.value.deadline && 
         electionForm.value.positions.length > 0 &&
         electionForm.value.positions.every(pos => 
           pos.title && pos.candidates.some(c => c.name)
         )
  
  // Email validation only required for email-based verification modes
  const emailRequired = electionForm.value.verificationMode === 'email' || 
                        electionForm.value.verificationMode === 'zkme-email'
  
  return baseValidation && (!emailRequired || totalVoterEmails.value.length > 0)
})

// Computed properties for email management
const totalVoterEmails = computed(() => {
  const allEmails = [...voterEmails.value, ...parsedManualEmails.value]
  return [...new Set(allEmails)] // Remove duplicates
})

const canSubmit = computed(() => {
  const baseValidation = electionForm.value.title && 
         electionForm.value.deadline && 
         electionForm.value.positions.length > 0 &&
         electionForm.value.positions.every(pos => 
           pos.title && pos.candidates.some(c => c.name)
         )
  
  // Email validation only required for email-based verification modes
  const emailRequired = electionForm.value.verificationMode === 'email' || 
                        electionForm.value.verificationMode === 'zkme-email'
  
  return baseValidation && (!emailRequired || totalVoterEmails.value.length > 0)
})
// Wallet functions
async function connectWallet() {
  try {
    await authStore.connectWallet()
    console.log('Wallet connected successfully')
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    alert('Failed to connect wallet. Please make sure Petra Wallet is installed and try again.')
  }
}

function disconnectWallet() {
  authStore.disconnectWallet()
}

// Position management
function addPosition() {
  electionForm.value.positions.push({
    title: '',
    description: '',
    maxSelections: 1,
    candidates: [
      { 
        name: '', 
        description: '', 
        party: '', 
        qualifications: '', 
        imageUrl: '' 
      }
    ]
  })
}

function removePosition(index) {
  if (electionForm.value.positions.length > 1) {
    electionForm.value.positions.splice(index, 1)
  }
}

// Candidate management
function addCandidate(positionIndex) {
  electionForm.value.positions[positionIndex].candidates.push({
    name: '', 
    description: '', 
    party: '', 
    qualifications: '', 
    imageUrl: ''
  })
}

function removeCandidate(positionIndex, candidateIndex) {
  const position = electionForm.value.positions[positionIndex]
  if (position.candidates.length > 1) {
    position.candidates.splice(candidateIndex, 1)
  }
}

// File upload functions
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB')
    return
  }
  
  voterFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target.result
      let emails = []
      
      if (file.name.endsWith('.csv')) {
        // Enhanced CSV parsing - handle both comma-separated and line-separated
        const lines = content.split('\n').filter(line => line.trim())
        emails = lines.flatMap(line => 
          line.split(',').map(email => email.trim()).filter(email => email.includes('@'))
        )
      } else if (file.name.endsWith('.json')) {
        const data = JSON.parse(content)
        emails = Array.isArray(data) ? data : (data.emails || [])
      } else if (file.name.endsWith('.txt')) {
        // Handle plain text files
        const lines = content.split('\n').filter(line => line.trim())
        emails = lines.map(line => line.trim()).filter(email => email.includes('@'))
      }
      
      // Validate emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      voterEmails.value = emails.filter(email => emailRegex.test(email))
      
      if (voterEmails.value.length === 0) {
        alert('No valid email addresses found in the file')
        voterFile.value = null
      } else {
        successMessage.value = `Successfully loaded ${voterEmails.value.length} email addresses`
        setTimeout(() => successMessage.value = '', 3000)
      }
      
    } catch (error) {
      console.error('Error parsing file:', error)
      errorMessage.value = 'Error reading file. Please check the format and try again.'
      voterFile.value = null
      setTimeout(() => errorMessage.value = '', 5000)
    }
  }
  
  reader.readAsText(file)
}

function handleFileDrop(event) {
  event.preventDefault()
  
  const files = event.dataTransfer.files
  if (files.length > 0) {
    handleFileUpload({ target: { files } })
  }
}

function removeFile() {
  voterFile.value = null
  voterEmails.value = []
}

// Manual email parsing with enhanced validation
function parseManualEmails() {
  const lines = manualEmails.value.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const validEmails = []
  const invalidLines = []
  
  // Email regex pattern for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  lines.forEach(line => {
    if (emailRegex.test(line)) {
      validEmails.push(line.toLowerCase())
    } else {
      invalidLines.push(line)
    }
  })
  
  parsedManualEmails.value = validEmails
  manualEmailErrors.value = invalidLines
}

function clearManualEmails() {
  manualEmails.value = ''
  parsedManualEmails.value = []
  manualEmailErrors.value = []
}

// Email management functions
function downloadVoterList() {
  const emailList = totalVoterEmails.value.join('\n')
  const blob = new Blob([emailList], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${electionForm.value.title || 'election'}_voters.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function clearAllEmails() {
  voterEmails.value = []
  parsedManualEmails.value = []
  manualEmailErrors.value = []
  manualEmails.value = ''
  voterFile.value = null
}

// --- Deadline Handling Helpers ---
function ensureDeadlineHasTime(deadlineStr) {
  // If the string is only a date (YYYY-MM-DD), add T23:59:59
  if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineStr)) {
    return `${deadlineStr}T23:59:59`;
  }
  // If the string is datetime-local but missing seconds, add :59
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(deadlineStr)) {
    return `${deadlineStr}:59`;
  }
  return deadlineStr;
}

function getDeadlineUTC(deadlineStr) {
  // Convert local datetime string to UTC ISO string
  const withTime = ensureDeadlineHasTime(deadlineStr);
  const localDate = new Date(withTime);
  return localDate.toISOString();
}

const deadlineWarning = ref('');
const utcDeadlinePreview = computed(() => {
  if (!electionForm.value.deadline) return '';
  try {
    return getDeadlineUTC(electionForm.value.deadline);
  } catch {
    return '';
  }
});

function validateDeadline() {
  deadlineWarning.value = '';
  if (!electionForm.value.deadline) return false;
  try {
    const utcDeadline = new Date(getDeadlineUTC(electionForm.value.deadline));
    const now = new Date();
    const diffMs = utcDeadline - now;
    if (diffMs < 60 * 60 * 1000) { // less than 1 hour in the future
      deadlineWarning.value = 'Warning: The deadline must be at least 1 hour in the future (UTC).';
      return false;
    }
    return true;
  } catch {
    deadlineWarning.value = 'Invalid deadline format.';
    return false;
  }
}

// Create election with full multi-position support
async function createElection() {
  if (!canCreateElection.value) return
  if (!validateDeadline()) {
    alert(deadlineWarning.value || 'Invalid deadline.');
    return;
  }
  creatingElection.value = true
  try {
    // Prepare full multi-position election data
    const electionData = {
      title: electionForm.value.title,
      description: electionForm.value.description,
      organization: electionForm.value.organization,
      deadline: getDeadlineUTC(electionForm.value.deadline),
      allowAbstain: electionForm.value.allowAbstain,
      requireAllPositions: electionForm.value.requireAllPositions,
      resultsVisible: electionForm.value.resultsVisible,
      positions: electionForm.value.positions.map(position => ({
        title: position.title,
        description: position.description,
        maxSelections: position.maxSelections,
        candidates: position.candidates.filter(c => c.name).map(candidate => ({
          name: candidate.name,
          description: candidate.description,
          party: candidate.party,
          qualifications: candidate.qualifications,
          imageUrl: candidate.imageUrl
        }))
      })).filter(pos => pos.candidates.length > 0),
      verificationMode: electionForm.value.verificationMode,
      voterEmails: (electionForm.value.verificationMode === 'email' || electionForm.value.verificationMode === 'zkme-email') 
                   ? totalVoterEmails.value 
                   : []
    }
    
    console.log('Creating election with data:', electionData)
    
    const response = await axios.post(`${API_BASE}/api/admin/elections`, electionData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    
    console.log('Election created:', response.data)
    
    // Show voting link to admin
    const slug = response.data.election.slug;
    votingLink.value = `${window.location.origin}/vote/${slug}`;
    
    // Reset form to initial state
    electionForm.value = {
      title: '',
      description: '',
      organization: '',
      deadline: '',
      allowAbstain: true,
      requireAllPositions: false,
      resultsVisible: false,
      allowMultipleSelections: false,
      allowRevoting: false,
      verificationMode: 'email',
      positions: [
        {
          title: '',
          description: '',
          maxSelections: 1,
          candidates: [
            { 
              name: '', 
              description: '', 
              party: '', 
              qualifications: '', 
              imageUrl: '' 
            }
          ]
        }
      ]
    }
    voterEmails.value = []
    voterFile.value = null
    
    alert(`Election "${response.data.election.title}" created successfully with ${response.data.election.positions.length} positions!`)
    
  } catch (error) {
    console.error('Error creating election:', error)
    alert('Failed to create election: ' + (error.response?.data?.message || error.message))
  } finally {
    creatingElection.value = false
  }
}

// Reset form to initial state
function resetForm() {
  electionForm.value = {
    title: '',
    description: '',
    organization: '',
    deadline: '',
    allowAbstain: true,
    requireAllPositions: false,
    resultsVisible: false,
    allowMultipleSelections: false,
    allowRevoting: false,
    verificationMode: 'email',
    positions: [
      {
        title: '',
        description: '',
        maxSelections: 1,
        candidates: [
          { 
            name: '', 
            description: '', 
            party: '', 
            qualifications: '', 
            imageUrl: '' 
          }
        ]
      }
    ]
  }
  clearAllEmails()
  successMessage.value = ''
  errorMessage.value = ''
}

// Initialize
onMounted(() => {
  // Check if wallet is already connected
  if (authStore.isLoggedIn) {
    console.log('Wallet already connected:', authStore.truncatedAddress)
  }
})
</script>

<style scoped>
/* Strictly Black & White Glassmorphic Design */

.admin-page {
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #000000 0%, #0f0f0f 50%, #000000 100%);
  position: relative;
  overflow-x: hidden;
  color: #ffffff;
}

.admin-page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.page-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header Section */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.header-content {
  margin-bottom: 2rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.section-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.wallet-section {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
}

.wallet-address {
  font-family: 'Monaco', 'Menlo', monospace;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Glassmorphic Container */
.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.glass-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
}

.header-content {
  background: var(--glass-light);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-2xl);
  padding: 3rem 2rem;
  box-shadow: var(--shadow-glass-xl);
  position: relative;
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
}

.header-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent);
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--color-gray-300);
  line-height: 1.6;
  font-weight: 400;
}

/* Enhanced Wallet Section */
.wallet-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  animation: slideInDown 0.6s ease-out;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wallet-address {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-gray-300);
  padding: 0.5rem 1rem;
  background: var(--glass-dark);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-md);
  min-height: 40px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* Wallet Prompt */
.wallet-prompt {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.prompt-card {
  max-width: 32rem;
  width: 100%;
}

.prompt-content {
  text-align: center;
  padding: 4rem 3rem;
}

.prompt-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-white);
  margin: 0 auto 2rem auto;
  opacity: 0.8;
}

.prompt-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.prompt-description {
  color: var(--color-gray-300);
  margin-bottom: 2.5rem;
  line-height: 1.6;
}

/* Form Container */
.create-election-section {
  max-width: 1000px;
  margin: 0 auto;
}

.form-container {
  padding: 3rem;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--glass-light);
}

.form-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.form-subtitle {
  color: var(--color-gray-300);
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Enhanced Form Sections */
.form-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-light);
}

.section-header svg {
  color: var(--color-gray-300);
}

.section-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--glass-light);
  border-radius: var(--radius-md);
  background: var(--glass-light);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  color: var(--color-white);
  font-size: 0.875rem;
  transition: all var(--transition-normal);
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-white);
  background: var(--glass-medium);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-gray-400);
}

/* Positions */
.positions-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.position-card {
  padding: 2rem;
  border: 1px solid var(--glass-medium);
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.position-title-section {
  flex: 1;
}

.position-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.position-name {
  font-size: 0.875rem;
  color: var(--color-gray-300);
  font-style: italic;
}

/* Candidates */
.candidates-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-light);
}

.candidates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.candidates-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.candidates-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.candidate-card {
  background: var(--glass-dark);
  border: 1px solid var(--glass-light);
  border-radius: var(--radius-md);
  padding: 1.5rem;
}

.candidate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.candidate-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-300);
}

/* Form Actions */
.form-actions {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-light);
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

/* Message Cards */
.message-card {
  margin-top: 2rem;
}

.message-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.message-icon {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.success-icon {
  color: var(--color-white);
}

.error-icon {
  color: var(--color-white);
}

.message-text {
  flex: 1;
}

.message-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.25rem 0;
}

.message-description {
  font-size: 0.875rem;
  color: var(--color-gray-300);
  margin: 0;
}

.success-card .glass-container {
  border-color: var(--color-white);
}

.error-card .glass-container {
  border-color: var(--color-gray-500);
}

/* Voter Upload Section Styles */
.voter-upload-section {
  margin-top: 1.5rem;
}

.upload-methods {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.upload-method {
  background: var(--glass-light);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all var(--transition-normal);
}

.upload-method:hover {
  background: var(--glass-medium);
  border-color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.upload-method-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.upload-method-description {
  color: var(--color-gray-300);
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

/* File Upload Area */
.upload-area {
  border: 2px dashed var(--color-gray-400);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: var(--glass-dark);
  position: relative;
  overflow: hidden;
}

.upload-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.upload-area:hover {
  border-color: var(--color-white);
  background: var(--glass-medium);
  transform: translateY(-2px);
}

.upload-area:hover::before {
  opacity: 1;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-placeholder svg {
  color: var(--color-gray-400);
  transition: all var(--transition-normal);
}

.upload-area:hover .upload-placeholder svg {
  color: var(--color-white);
  transform: scale(1.1);
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.upload-subtitle {
  font-size: 0.875rem;
  color: var(--color-gray-300);
  margin: 0;
}

.upload-success {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--glass-medium);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-white);
}

.upload-success svg {
  color: var(--color-white);
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.25rem 0;
}

.file-stats {
  font-size: 0.75rem;
  color: var(--color-gray-300);
  margin: 0;
}

.remove-file-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-file-btn:hover {
  color: var(--color-white);
  background: var(--glass-light);
}

.upload-format-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--glass-dark);
  border-radius: var(--radius-md);
  border: 1px solid var(--glass-light);
}

.upload-format-info h5 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.75rem 0;
}

.upload-format-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-format-info li {
  font-size: 0.75rem;
  color: var(--color-gray-300);
  line-height: 1.4;
}

.upload-format-info strong {
  color: var(--color-white);
  font-weight: 600;
}

/* Manual Email Entry */
.manual-email-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-textarea {
  width: 100%;
  min-height: 160px;
  padding: 1rem;
  background: var(--glass-dark);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
  transition: all var(--transition-normal);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
}

.email-textarea:focus {
  outline: none;
  border-color: var(--color-white);
  background: var(--glass-medium);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.email-textarea::placeholder {
  color: var(--color-gray-400);
  font-style: italic;
}

.textarea-container {
  position: relative;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  gap: 1rem;
}

.char-count {
  font-size: 0.75rem;
  color: var(--color-gray-400);
}

.clear-textarea-btn {
  background: none;
  border: 1px solid var(--glass-medium);
  color: var(--color-gray-300);
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.clear-textarea-btn:hover {
  border-color: var(--color-white);
  color: var(--color-white);
  background: var(--glass-light);
}

.valid-emails,
.invalid-emails {
  margin-bottom: 1rem;
}

.invalid-emails:last-child {
  margin-bottom: 0;
}

.preview-count,
.error-count {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-count {
  color: var(--color-white);
}

.preview-count svg {
  color: var(--color-white);
}

.error-count {
  color: var(--color-gray-400);
}

.error-count svg {
  color: var(--color-gray-500);
}

.error-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.email-tag.valid {
  background: var(--glass-dark);
  border-color: var(--color-white);
  color: var(--color-white);
}

.email-tag.invalid {
  background: var(--glass-dark);
  border-color: var(--color-gray-500);
  color: var(--color-gray-400);
  text-decoration: line-through;
}

.email-tag-more.error {
  background: var(--color-gray-500);
  color: var(--color-white);
}

/* Email Required Warning */
.email-required-warning {
  margin-top: 2rem;
  padding: 2rem;
  background: var(--glass-dark);
  border: 1px solid var(--color-gray-500);
  border-radius: var(--radius-lg);
  position: relative;
  overflow: hidden;
}

.email-required-warning::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.warning-content svg {
  color: var(--color-gray-400);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.warning-text h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.5rem 0;
}

.warning-text p {
  font-size: 0.875rem;
  color: var(--color-gray-300);
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design for Upload Section */
@media (min-width: 768px) {
  .upload-methods {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .upload-area {
    padding: 4rem 2rem;
  }
}

@media (max-width: 640px) {
  .upload-method {
    padding: 1.5rem;
  }
  
  .upload-area {
    padding: 2rem 1rem;
  }
  
  .upload-success {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .file-info {
    text-align: center;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .summary-actions {
    justify-content: center;
  }
  
  .email-tags {
    justify-content: center;
  }
  
  .email-tag {
    max-width: 150px;
  }
}

.voting-link-success {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--glass-dark, #222c);
  border-radius: 1rem;
  border: 1px solid var(--glass-medium, #444a);
  text-align: center;
}
.voting-link-success input {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
</style>
