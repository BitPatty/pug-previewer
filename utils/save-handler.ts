type Save = { content: string; values: string };

type Saves = Record<string, Save>;

class SaveHandler {
  public static loadSaves(): Saves {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('saves') ?? '{}');
    } catch {
      return {};
    }
  }

  public static addSave(save: Save): string {
    if (typeof window === 'undefined')
      throw new Error('Cannot save server side');
    const saves = SaveHandler.loadSaves();
    const k = new Date().toLocaleString();
    saves[k] = save;
    localStorage.setItem('saves', JSON.stringify(saves));
    return k;
  }

  public static deleteSave(key: string): void {
    if (typeof window === 'undefined')
      throw new Error('Cannot delete save server side');

    const saves = SaveHandler.loadSaves();
    delete saves[key];
    localStorage.setItem('saves', JSON.stringify(saves));
  }
}

export default SaveHandler;
export type { Saves, Save };
