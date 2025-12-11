# Planning Guide

A cryptocurrency portfolio management demo application that simulates staking, deposits, and trading functionality for educational purposes without real blockchain integration.

**Experience Qualities**: 
1. **Professional** - Clean, trustworthy interface that reflects financial application standards with clear data presentation
2. **Confident** - Bold visual hierarchy and decisive interactions that make users feel in control of their portfolio
3. **Modern** - Contemporary crypto-native aesthetic with sleek gradients and sharp typography

**Complexity Level**: Light Application (multiple features with basic state)
This is a portfolio tracking tool with simulated transactions. It manages multiple feature areas (balance, transfers, swaps, deposits, staking, history) but uses straightforward state management with no external APIs or complex data synchronization.

## Essential Features

### Balance Display
- **Functionality**: Shows total portfolio value in USD and breakdown by cryptocurrency holdings
- **Purpose**: Provides immediate overview of user's simulated crypto assets
- **Trigger**: Automatically displayed on app load and updated after any transaction
- **Progression**: App loads → Balance calculates from holdings → Displays total with individual coin breakdowns → Updates in real-time
- **Success criteria**: Balance accurately reflects sum of all holdings at current simulated prices

### Receive (Получить)
- **Functionality**: Generates a simulated wallet address for receiving cryptocurrency
- **Purpose**: Demonstrates how users would receive crypto deposits (educational)
- **Trigger**: User clicks "Receive" button
- **Progression**: Click Receive → Select cryptocurrency → Display address with QR code → Copy address option → Close dialog
- **Success criteria**: Generates unique-looking addresses for different cryptocurrencies

### Send (Отправить)
- **Functionality**: Simulates sending cryptocurrency to another address
- **Purpose**: Allows users to practice the flow of sending crypto
- **Trigger**: User clicks "Send" button
- **Progression**: Click Send → Select cryptocurrency → Enter recipient address → Enter amount → Review transaction → Confirm → Balance updates → Transaction appears in history
- **Success criteria**: Balance decreases by sent amount, transaction logged with timestamp

### Swap (Обменять)
- **Functionality**: Simulates exchanging one cryptocurrency for another
- **Purpose**: Demonstrates crypto trading functionality
- **Trigger**: User clicks "Swap" button
- **Progression**: Click Swap → Select source crypto → Enter amount → Select target crypto → Show exchange rate → Confirm → Both balances update → Transaction logged
- **Success criteria**: Both crypto balances update correctly based on simulated exchange rate

### Deposits (Депозиты)
- **Functionality**: Lock cryptocurrency for fixed term to earn simulated interest
- **Purpose**: Demonstrates time-locked savings products
- **Trigger**: User clicks "Deposits" tab/button
- **Progression**: View deposits → Create new deposit → Select cryptocurrency → Choose term (30/60/90 days) → See APY → Confirm → Funds locked → Track maturity date
- **Success criteria**: Locked funds removed from available balance, maturity date calculated, interest preview shown

### Staking (Стейкинг)
- **Functionality**: Stake cryptocurrency to earn simulated rewards over time
- **Purpose**: Demonstrates flexible staking with ongoing rewards
- **Trigger**: User clicks "Staking" tab/button
- **Progression**: View staking → Select cryptocurrency → Enter stake amount → See APY → Confirm → Stake active → Rewards accumulate → Can unstake anytime
- **Success criteria**: Staked amount locked, rewards calculate based on time staked, can unstake back to balance

### History (История)
- **Functionality**: Displays chronological log of all transactions
- **Purpose**: Provides transaction audit trail
- **Trigger**: User clicks "History" tab/button
- **Progression**: View history → See transactions sorted by date → Filter by type → View transaction details → Export option
- **Success criteria**: All send/receive/swap/stake/unstake/deposit actions logged with timestamps and details

## Edge Case Handling
- **Insufficient Balance**: Prevent transactions exceeding available balance with clear error messaging
- **Invalid Addresses**: Validate address format for send transactions (basic format check)
- **Zero/Negative Amounts**: Reject invalid transaction amounts with validation feedback
- **Empty Portfolio**: Show welcoming empty state with suggestion to add funds or view demo data
- **Pending Operations**: Disable duplicate actions while transaction is processing (prevent double-spend)
- **Locked Funds**: Clearly distinguish between available, staked, and deposited funds

## Design Direction
The design should evoke confidence, security, and modernity. Users should feel they're interacting with a professional financial platform. The aesthetic should embrace crypto-native design patterns - dark sophisticated backgrounds with vibrant accent colors, sharp edges mixed with strategic roundness, and clear data hierarchy. Should feel premium but not intimidating.

## Color Selection
A sophisticated dark-to-light gradient theme with electric accent colors that convey energy and technological innovation.

- **Primary Color**: Deep electric blue (`oklch(0.45 0.19 250)`) - Represents trust, technology, and financial stability. Used for primary actions and key UI elements.
- **Secondary Colors**: 
  - Dark navy background (`oklch(0.15 0.03 250)`) - Creates depth and sophistication
  - Slate gray (`oklch(0.35 0.02 250)`) - For secondary surfaces and cards
- **Accent Color**: Vibrant cyan (`oklch(0.75 0.15 195)`) - High-energy highlight for CTAs, positive numbers, and active states. Conveys growth and opportunity.
- **Foreground/Background Pairings**: 
  - Background (Dark Navy `oklch(0.15 0.03 250)`): White text (`oklch(0.98 0 0)`) - Ratio 11.2:1 ✓
  - Primary (Electric Blue `oklch(0.45 0.19 250)`): White text (`oklch(0.98 0 0)`) - Ratio 5.1:1 ✓
  - Accent (Cyan `oklch(0.75 0.15 195)`): Dark text (`oklch(0.15 0.03 250)`) - Ratio 8.3:1 ✓
  - Card (Slate `oklch(0.35 0.02 250)`): White text (`oklch(0.98 0 0)`) - Ratio 7.8:1 ✓

## Font Selection
Typography should project precision and modernity while maintaining excellent readability for numbers and financial data.

**Primary Font**: Space Grotesk - A geometric sans-serif with technical sophistication that works perfectly for both headings and financial figures. Its distinctive letterforms create visual interest while maintaining clarity.

**Secondary Font**: JetBrains Mono - For addresses, transaction IDs, and numerical data where monospace clarity is essential.

- **Typographic Hierarchy**: 
  - H1 (Balance Amount): Space Grotesk Bold/48px/tight letter-spacing/-0.02em
  - H2 (Section Headers): Space Grotesk Bold/28px/normal/letter-spacing/-0.01em  
  - H3 (Card Titles): Space Grotesk Semibold/20px/normal
  - Body (General Text): Space Grotesk Regular/16px/line-height 1.6
  - Small (Labels): Space Grotesk Medium/14px/line-height 1.4
  - Code (Addresses/IDs): JetBrains Mono Regular/14px/line-height 1.5

## Animations
Animations should be purposeful and reinforce the sense of value transfer and state changes. Balance updates should feel momentous with smooth counting animations. Transactions should have subtle confirmation feedback. Navigation between sections should be swift and directional. Card hovers should lift slightly to suggest interactivity. Loading states for transactions should pulse with the accent color. Success states should briefly highlight with green glow. Keep all animations under 300ms except for number countups which can take 800ms for emphasis.

## Component Selection
- **Components**: 
  - Tabs component for main navigation (Balance/Deposits/Staking/History)
  - Card components for displaying balance, holdings, active stakes/deposits
  - Dialog for Send/Receive/Swap modals
  - Select dropdown for cryptocurrency selection
  - Input fields for amounts and addresses
  - Button variants (primary for actions, ghost for secondary)
  - Table for transaction history
  - Badge for status indicators (Active/Locked/Completed)
  - Progress bars for deposit/staking terms
  - Alert for notifications and confirmations
- **Customizations**: 
  - Custom balance display card with large numbers and gradient background
  - Custom crypto icon component with colored backgrounds
  - Animated number counter for balance changes
  - Custom transaction list item with type-specific icons
- **States**: 
  - Buttons: Default with border, hover with glow effect, active with press animation, disabled with reduced opacity
  - Inputs: Default with subtle border, focus with accent glow ring, error with red border and shake animation
  - Cards: Default flat, hover with subtle lift and shadow, selected with accent border
- **Icon Selection**: 
  - @phosphor-icons/react: Wallet for balance, ArrowUp/ArrowDown for send/receive, ArrowsLeftRight for swap, LockKey for deposits, ChartLineUp for staking, ClockCounterClockwise for history, Copy for address copying, Check for confirmations
- **Spacing**: 
  - Container padding: p-6 (24px)
  - Card gaps: gap-4 (16px) for internal spacing
  - Section margins: mb-8 (32px) between major sections
  - Input spacing: space-y-4 (16px) between form fields
  - Button padding: px-6 py-3 for primary actions
- **Mobile**: 
  - Tabs convert to bottom navigation bar on mobile
  - Cards stack vertically with full width
  - Dialogs become bottom sheets (drawer component)
  - Balance display scales down to 32px font
  - Two-column grids become single column below 768px
  - Touch targets minimum 44px height
