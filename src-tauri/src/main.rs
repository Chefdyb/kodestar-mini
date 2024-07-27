// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;
use tauri::command;
mod fc;
mod zip;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn open_folder(folder_path: &str) -> String {
    let files = fc::read_directory(folder_path);
    files
}

#[tauri::command]
fn get_file_content(file_path: &str) -> String {
    let content = fc::read_file(file_path);
    content
}

#[tauri::command]
fn write_file(file_path: &str, content: &str) -> String {
    fc::write_file(file_path, content);
    String::from("OK")
}

#[tauri::command]
fn remove_file(file_path: &str) -> String {
    fc::remove_file(file_path);
    String::from("OK")
}

#[tauri::command]
fn remove_folder(file_path: &str) -> String {
    fc::remove_folder(file_path);
    String::from("OK")
}

#[tauri::command]
fn create_directory(file_path: &str) -> String {
    fc::create_directory(file_path);
    String::from("OK")
}

#[tauri::command]
fn rename_file(old_path: &str, new_path: &str) -> String {
    let result = fc::rename_file(old_path, new_path);
    match result {
        Ok(_) => String::from("OK"),
        Err(_) => String::from("ERROR"),
    }
}

#[command]
fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    Command::new("explorer")
        .arg(path)
        .spawn()
        .expect("Failed to open folder");

    #[cfg(target_os = "macos")]
    Command::new("open")
        .arg(path)
        .spawn()
        .expect("Failed to open folder");

    #[cfg(target_os = "linux")]
    Command::new("xdg-open")
        .arg(path)
        .spawn()
        .expect("Failed to open folder");
}

//THE TERMINAL SHIT GOES HERE
mod pty;
mod shell;
mod utils;
use portable_pty::{native_pty_system, PtySize};
use pty::pty::{resize_pty, write_to_pty};
use shell::shell::async_shell;
use std::{
    io::{BufRead, BufReader},
    sync::{Arc, Mutex},
    thread::{self, sleep},
    time::Duration,
};
use tauri::async_runtime::Mutex as AsyncMutex;
use utils::app_state::AppState;

fn main() {
    let pty_system = native_pty_system();

    let pty_pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .unwrap();

    let reader = pty_pair.master.try_clone_reader().unwrap();
    let writer = pty_pair.master.take_writer().unwrap();

    let reader = Arc::new(Mutex::new(Some(BufReader::new(reader))));
    let output = Arc::new(Mutex::new(String::new())); // Added output buffer
    tauri::Builder::default()
        .manage(AppState {
            pty_pair: AsyncMutex::new(pty_pair),
            writer: AsyncMutex::new(writer),
        })
        .on_page_load(move |window, _| {
            let window = window.clone();
            let reader = reader.clone();
            let output = output.clone();

            thread::spawn(move || {
                let reader = reader.lock().unwrap().take();
                if let Some(mut reader) = reader {
                    loop {
                        sleep(Duration::from_millis(1));
                        let data = reader.fill_buf().unwrap().to_vec();
                        reader.consume(data.len());
                        if data.len() > 0 {
                            output
                                .lock()
                                .unwrap()
                                .push_str(&String::from_utf8_lossy(&data));
                            window.emit("data", data).unwrap();
                        }
                    }
                }
            });
        })
        .invoke_handler(tauri::generate_handler![
            write_to_pty,
            resize_pty,
            async_shell,
            open_folder,
            get_file_content,
            write_file,
            remove_file,
            remove_folder,
            create_directory,
            zip::zip_dir,
            show_in_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
