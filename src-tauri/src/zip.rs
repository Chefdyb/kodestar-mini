// src/zipper.rs
use std::fs::File;
use std::io::BufWriter;
use std::path::Path;
use walkdir::WalkDir;
use zip::write::FileOptions;
use zip::ZipWriter;

#[tauri::command]
pub fn zip_dir(src_dir: String, dst_file: String) -> Result<(), String> {
    let path = Path::new(&src_dir);
    let file = File::create(&dst_file).map_err(|e| e.to_string())?;
    let walkdir = WalkDir::new(path);
    let it = walkdir.into_iter();

    let mut zip = ZipWriter::new(BufWriter::new(file));
    let options: FileOptions<()> = FileOptions::default()
        .compression_method(zip::CompressionMethod::Stored) // Change to Deflated if compression is needed
        .unix_permissions(0o755);

    for entry in it {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let name = path
            .strip_prefix(Path::new(&src_dir))
            .map_err(|e| e.to_string())?;

        if path.is_file() {
            zip.start_file_from_path(name, options)
                .map_err(|e| e.to_string())?;
            let mut f = File::open(path).map_err(|e| e.to_string())?;
            std::io::copy(&mut f, &mut zip).map_err(|e| e.to_string())?;
        } else if !name.as_os_str().is_empty() {
            zip.add_directory_from_path(name, options)
                .map_err(|e| e.to_string())?;
        }
    }

    zip.finish().map_err(|e| e.to_string())?;
    Ok(())
}
