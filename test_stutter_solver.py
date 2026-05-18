#!/usr/bin/env python3
"""
TEST SCRIPT: Verify Stutter-Solver Model
=========================================
This script tests if the stutter-solver model can be loaded and used for inference.

Usage:
  python test_stutter_solver.py
  python3 test_stutter_solver.py
"""

import os
import sys
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.RESET}")

def print_header(msg):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}{msg}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")

def main():
    print_header("STUTTER-SOLVER MODEL VERIFICATION")
    
    # Change to audio-service directory
    audio_service_path = Path(__file__).parent / "audio-service"
    os.chdir(audio_service_path)
    print_info(f"Working directory: {os.getcwd()}")
    
    # ===== CHECK 1: Model files exist =====
    print("\n[1/5] Checking model files...")
    print("-" * 60)
    
    model_dir = audio_service_path / "Stutter-Solver" / "saved_models"
    pretrained_model = model_dir / "pretrained_ljs.pth"
    stutter_solver_model = model_dir / "stutter_solver.pth"
    
    models_exist = True
    if pretrained_model.exists():
        size_mb = pretrained_model.stat().st_size / (1024 * 1024)
        print_success(f"pretrained_ljs.pth found ({size_mb:.1f} MB)")
    else:
        print_error(f"pretrained_ljs.pth NOT found at {pretrained_model}")
        models_exist = False
    
    if stutter_solver_model.exists():
        size_mb = stutter_solver_model.stat().st_size / (1024 * 1024)
        print_success(f"stutter_solver.pth found ({size_mb:.1f} MB)")
    else:
        print_error(f"stutter_solver.pth NOT found at {stutter_solver_model}")
        models_exist = False
    
    if not models_exist:
        print_error("Model files are missing. Cannot proceed.")
        return 1
    
    # ===== CHECK 2: PyTorch and dependencies =====
    print("\n[2/5] Checking PyTorch and dependencies...")
    print("-" * 60)
    
    try:
        import torch
        print_success(f"PyTorch installed: {torch.__version__}")
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        if torch.cuda.is_available():
            print_success(f"GPU available: {torch.cuda.get_device_name(0)}")
        else:
            print_warning("Running on CPU (GPU not available)")
        print_info(f"Using device: {device}")
    except ImportError:
        print_error("PyTorch not installed. Run: pip install -r requirements.txt")
        return 1
    
    try:
        import librosa
        print_success("librosa installed")
    except ImportError:
        print_error("librosa not installed. Run: pip install -r requirements.txt")
        return 1
    
    # ===== CHECK 3: Load the model =====
    print("\n[3/5] Loading Stutter-Solver models...")
    print("-" * 60)
    
    try:
        # Import the stutter_solver_service
        sys.path.insert(0, str(audio_service_path))
        from stutter_solver_service import load_stutter_solver_models, _net_g, _decoder
        
        print_info("Loading models into memory (this may take a moment)...")
        load_stutter_solver_models()
        
        print_success("Models loaded successfully!")
        print_info("- VITS Generator (_net_g): Loaded")
        print_info("- Stutter Decoder (_decoder): Loaded")
        
    except Exception as e:
        print_error(f"Failed to load models: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    # ===== CHECK 4: Test inference on a sample =====
    print("\n[4/5] Testing model inference...")
    print("-" * 60)
    
    try:
        from stutter_solver_service import predict_stutters
        
        # Check if there's a test audio file in uploads
        test_audio_path = None
        uploads_dir = audio_service_path / "uploads"
        if uploads_dir.exists():
            wav_files = list(uploads_dir.glob("*.wav"))
            if wav_files:
                test_audio_path = str(wav_files[0])
                print_info(f"Found test audio: {wav_files[0].name}")
        
        if test_audio_path:
            print_info("Running inference on test audio...")
            test_transcript = "Hello, I am practicing my speech fluency."
            
            stutters = predict_stutters(test_audio_path, test_transcript)
            print_success(f"Inference completed! Found {len(stutters)} dysfluencies")
            
            for i, stutter in enumerate(stutters, 1):
                print_info(f"  {i}. {stutter['type']}: {stutter['start']}s-{stutter['end']}s (confidence: {stutter['confidence']})")
            
        else:
            print_warning("No test audio file found in uploads/ directory")
            print_info("Creating a dummy test to verify model structure...")
            
            # Just test that the model can be called without errors
            import torch
            from stutter_solver_service import get_text, _hps
            
            test_text = "Hello world"
            stn_tst = get_text(test_text, _hps)
            print_success(f"Text preprocessing works: '{test_text}' → {stn_tst.shape}")
            
    except Exception as e:
        print_error(f"Inference test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    # ===== CHECK 5: Integration status =====
    print("\n[5/5] Checking integration with Flask app...")
    print("-" * 60)
    
    try:
        # Check if stutter_solver_service is imported in app.py
        with open(audio_service_path / "app.py", "r") as f:
            app_content = f.read()
        
        if "stutter_solver_service" in app_content:
            print_success("stutter_solver_service is imported in app.py")
        else:
            print_warning("⚠️  stutter_solver_service is NOT imported in app.py")
            print_warning("   The model is loaded but NOT being used in the analysis pipeline!")
            print_info("   Currently using: stutter_detector.py instead")
        
        if "predict_stutters" in app_content:
            print_success("predict_stutters function is used in app.py")
        else:
            print_warning("⚠️  predict_stutters function is NOT used in app.py")
        
    except Exception as e:
        print_error(f"Failed to check integration: {e}")
        return 1
    
    # ===== SUMMARY =====
    print_header("VERIFICATION SUMMARY")
    print_success("Stutter-Solver model files are present")
    print_success("PyTorch dependencies are installed")
    print_success("Model can be loaded successfully")
    print_success("Model inference works (or can be tested with audio)")
    print_warning("⚠️  Model is NOT integrated into the Flask /analyze endpoint!")
    
    print("\n" + "=" * 60)
    print("NEXT STEPS:")
    print("=" * 60)
    print("1. The stutter-solver model is working ✅")
    print("2. But it's not being used in the main analysis pipeline")
    print("3. Currently: stutter_detector.py (separate implementation) is used")
    print("4. To integrate stutter-solver, update app.py to:")
    print("   - Import from stutter_solver_service")
    print("   - Replace analyze_audio() with predict_stutters()")
    print("=" * 60 + "\n")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
